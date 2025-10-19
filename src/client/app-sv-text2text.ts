/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

/*  external dependencies  */
import { EventEmitter }         from "events"
import OpenAI                   from "openai"
import { ChatCompletionStream } from "openai/lib/ChatCompletionStream"
import { toFile }               from "openai/uploads"

/*  internal dependencies  */
import TextExtract              from "./app-sv-textextract"

/*  type of attachment  */
export type Text2TextAttachment = {
    name: string,
    data: ArrayBuffer
}

/*  type of constructor options  */
export type Text2TextOptions = {
    apiToken:     string,
    model:        string,
    apiType:      string,
    attachments:  Text2TextAttachment[],
    prompt:       string,
    temperature:  number,
    seed:         number,
    maxTokens:    number
}

/*  type of text chunk  */
export type Text2TextChunk = {
    text:     string,
    final:    boolean
}

/*  Text-to-Text API class  */
export default class Text2Text extends EventEmitter {
    /*  default option values  */
    private options = {
        apiToken:     "",
        model:        "gpt-4o-mini",
        apiType:      "completion",
        attachments:  [] as Text2TextAttachment[],
        prompt:       "",
        temperature:  1.0,
        seed:         1,
        maxTokens:    10
    } as Text2TextOptions

    /*  name to use in front of OpenAI  */
    private namespace = "Studio AI"

    /*  internal state (OpenAI API shared use)  */
    private client:    OpenAI                               | null = null

    /*  internal state (OpenAI Assistant API only)  */
    private assistant: OpenAI.Beta.Assistants.Assistant     | null = null
    private documents: OpenAI.Files.FileObject[]            | null = null
    private store:     OpenAI.VectorStores.VectorStore      | null = null
    private thread:    OpenAI.Beta.Thread                   | null = null

    /*  internal state (OpenAI Completion API only)  */
    private stream: ChatCompletionStream | null = null
    private dialog = [] as Array<OpenAI.ChatCompletionMessageParam>

    /*  API class constructor  */
    constructor (options: Text2TextOptions) {
        super()
        this.options.apiToken     = options.apiToken
        this.options.model        = options.model
        this.options.apiType      = options.apiType
        this.options.attachments  = options.attachments
        this.options.prompt       = options.prompt
        this.options.temperature  = options.temperature
        this.options.seed         = options.seed
        this.options.maxTokens    = options.maxTokens
    }

    /*  minimum logging handling  */
    log (level: string, msg: string) {
        this.emit("log", level, msg)
    }

    /*  minimum traffic monitoring  */
    traffic (flags: { send?: boolean, recv?: boolean }) {
        this.emit("traffic", flags)
    }

    /*  minimum fatal error handling  */
    error (reason: string | Error): never {
        const error = typeof reason === "string" ? new Error(reason) : reason
        this.emit("log", "ERROR", error.toString())
        throw error
    }

    /*  open Text-to-Text engine  */
    async open () {
        /*  create OpenAI client  */
        this.log("INFO", "OpenAI: create client")
        this.client = new OpenAI({
            apiKey: this.options.apiToken,
            dangerouslyAllowBrowser: true
        })

        /*  dispatch according to API use...  */
        if (this.options.apiType === "assistant") {
            /*  create OpenAI assistant  */
            this.log("INFO", "OpenAI: retrieve (or create) assistant")
            const assistants: OpenAI.Beta.Assistants.Assistant[] = []
            const assistantsList = await this.client.beta.assistants.list({ limit: 10 })
            for await (const page of assistantsList.iterPages())
                page.getPaginatedItems().forEach((assistant) => { assistants.push(assistant) })
            const assistant = assistants.find((assistant) => assistant.name === this.namespace)
            if (assistant !== undefined)
                this.assistant = assistant
            else {
                this.assistant = await this.client.beta.assistants.create({
                    name:         this.namespace,
                    instructions: this.options.prompt,
                    model:        this.options.model,
                    temperature:  this.options.temperature,
                    tools:        [ { type: "file_search" } ]
                })
            }

            /*  synchronize files with OpenAI platform  */
            this.log("INFO", "OpenAI: synchronize attachments with uploaded files")
            this.documents = [] as OpenAI.Files.FileObject[]
            const files = [] as { file: OpenAI.Files.FileObject, current: boolean }[]
            const filesList = await this.client.files.list({ purpose: "assistants" })
            for await (const page of filesList.iterPages())
                page.getPaginatedItems().forEach((file) => { files.push({ file, current: false }) })
            for (const attachment of this.options.attachments) {
                let document: OpenAI.Files.FileObject | null = null
                const entry = files.find((entry) => entry.file.filename === attachment.name)
                if (entry !== undefined) {
                    this.log("INFO", `OpenAI: uploaded file "${attachment.name}": already uploaded`)
                    document = entry.file
                    entry.current = true
                }
                else {
                    this.log("INFO", `OpenAI: uploaded file "${attachment.name}": uploading`)
                    const file = await toFile(attachment.data, attachment.name)
                    document = await this.client.files.create({ file, purpose: "assistants" })
                    files.push({ file: document, current: true })
                }
                this.documents.push(document)
            }
            for (const entry of files)
                if (!entry.current)
                    await this.client.files.delete(entry.file.id)

            /*  create OpenAI vector store  */
            this.log("INFO", "OpenAI: retrieve (or create) vector store for thread attachments")
            const stores: OpenAI.VectorStores.VectorStore[] = []
            const storesList = await this.client.vectorStores.list({ limit: 10 })
            for await (const page of storesList.iterPages())
                page.getPaginatedItems().forEach((store) => { stores.push(store) })
            const store = stores.find((store) => store.name === this.namespace)
            if (store !== undefined)
                this.store = store
            if (this.store === null) {
                this.store = await this.client.vectorStores.create({
                    name:          this.namespace,
                    expires_after: { anchor: "last_active_at", days: 1 }
                })
            }

            /*  synchronize OpenAI thread attachments  */
            this.log("INFO", "OpenAI: synchronize thread attachments with vector store")
            const storeFiles = [] as { file: OpenAI.VectorStores.VectorStoreFile, current: boolean }[]
            const storeFilesList = await this.client.vectorStores.files.list(this.store.id)
            for await (const page of storeFilesList.iterPages())
                page.getPaginatedItems().forEach((file) => { storeFiles.push({ file, current: false }) })
            for (const attachment of this.options.attachments) {
                const file = this.documents.find((document) => document.filename === attachment.name)!
                const entry = storeFiles.find((entry) => entry.file.id === file.id)
                if (entry !== undefined) {
                    this.log("INFO", `OpenAI: vector store file "${attachment.name}": already exists`)
                    entry.current = true
                }
                else {
                    this.log("INFO", `OpenAI: vector store file "${attachment.name}": linking`)
                    await this.client.vectorStores.files.create(this.store.id, { file_id: file.id })
                }
            }
            for (const entry of storeFiles)
                if (!entry.current)
                    await this.client.vectorStores.files.delete(entry.file.id, { vector_store_id: this.store.id })

            /*  create OpenAI thread  */
            this.log("INFO", "OpenAI: create thread")
            this.thread = await this.client.beta.threads.create({
                ...(this.options.attachments.length > 0 ? {
                    tool_resources: {
                        file_search: {
                            vector_store_ids: [ this.store.id ]
                        }
                    }
                } : {})
            })

            /*  create OpenAI thread attachment messages  */
            if (this.options.attachments.length > 0) {
                const attachments = [] as OpenAI.Beta.Threads.Messages.MessageCreateParams.Attachment[]
                for (const document of this.documents)
                    attachments.push({
                        file_id: document.id,
                        tools: [ { type: "file_search" } ]
                    })
                await this.client.beta.threads.messages.create(this.thread.id, {
                    role: "user",
                    content: "system documents",
                    attachments
                })
            }
        }
        else if (this.options.apiType === "completion") {
            this.dialog = [] as Array<OpenAI.ChatCompletionMessageParam>
            this.dialog.push({ role: "system", content: this.options.prompt })
            if (this.options.attachments.length > 0) {
                const te = new TextExtract()
                te.on("log", (level: string, message: string) => {
                    this.log(level, `text extraction: ${message}`)
                })
                for (const attachment of this.options.attachments) {
                    const content = await te.textExtract(attachment.name, attachment.data)
                    if (content !== "")
                        this.dialog.push({ role: "assistant", content })
                }
            }
        }

        this.log("INFO", "OpenAI: ready for operation")
        this.emit("open")
    }

    /*  send message to Text-to-Text engine and retrieve answer  */
    async send (message: string) {
        if (this.client === null)
            return

        /*  dispatch according to API use...  */
        if (this.options.apiType === "assistant") {
            /*  append message to thread  */
            this.log("INFO", "OpenAI: send message to thread")
            await this.client.beta.threads.messages.create(
                this.thread!.id, { role: "user", content: message })

            /*  run thread once (again)  */
            this.traffic({ send: true })
            const run = this.client.beta.threads.runs.stream(this.thread!.id, {
                assistant_id: this.assistant!.id,
                max_completion_tokens: this.options.maxTokens,
                include: this.options.attachments.length > 0 ?
                    [ "step_details.tool_calls[*].file_search.results[*].content" ] :
                    []
            })

            /*  retrieve text results from thread run  */
            run.on("textDelta", (delta, snapshot) => {
                /*  case 1: intermediate result  */
                this.traffic({ recv: true })
                let text = snapshot.value
                if (snapshot.annotations)
                    for (const annotation of snapshot.annotations)
                        text = text.replace(annotation.text, "")
                text = text.replace(/\.\s+\./g, ".")
                this.emit("text", { text, final: false } as Text2TextChunk)
            })
            run.on("textDone", (content, snapshot) => {
                /*  case 2: final result  */
                this.traffic({ recv: true })
                let text = content.value
                if (content.annotations)
                    for (const annotation of content.annotations)
                        text = text.replace(annotation.text, "")
                text = text.replace(/\.\s+\./g, ".")
                this.emit("text", { text, final: true } as Text2TextChunk)
            })
        }
        else if (this.options.apiType === "completion") {
            this.dialog.push({ role: "user", content: message })
            this.traffic({ send: true })
            this.stream = this.client.chat.completions.stream({
                stream:                true,
                model:                 this.options.model,
                seed:                  this.options.seed !== 0 ? this.options.seed : null,
                temperature:           this.options.model.match(/^o[34]/) ? 1.0 : this.options.temperature,
                max_completion_tokens: this.options.maxTokens,
                n:                     1,
                messages:              this.dialog
            })
            this.stream.on("content", (delta, snapshot) => {
                this.traffic({ recv: true })
                this.emit("text", { text: snapshot, final: false } as Text2TextChunk)
            })
            const completion = await this.stream.finalChatCompletion()
            const response = completion.choices[0].message.content!
            this.emit("text", { text: response, final: true } as Text2TextChunk)
            this.dialog.push({ role: "assistant", content: response })
        }
    }

    /*  close Text-to-Text engine  */
    async close () {
        if (this.client !== null) {
            /*  dispatch according to API use...  */
            if (this.options.apiType === "assistant") {
                /*  delete OpenAI thread  */
                if (this.thread !== null) {
                    this.log("INFO", "OpenAI: delete thread")
                    await this.client.beta.threads.delete(this.thread.id)
                    this.thread = null
                }

                /*  delete OpenAI vector store  */
                if (this.store !== null) {
                    this.log("INFO", "OpenAI: delete vector store")
                    await this.client.vectorStores.delete(this.store.id)
                    this.store = null
                }

                /*  delete OpenAI uploaded files  */
                if (this.documents !== null) {
                    this.log("INFO", "OpenAI: delete uploaded files")
                    for (const document of this.documents)
                        await this.client.files.delete(document.id)
                    this.documents = null
                }

                /*  delete OpenAI assistant  */
                if (this.assistant !== null) {
                    this.log("INFO", "OpenAI: delete assistant")
                    await this.client.beta.assistants.delete(this.assistant.id)
                    this.assistant = null
                }
            }
            else if (this.options.apiType === "completion") {
                /*  delete OpenAI completions stream  */
                if (this.stream !== null) {
                    if (!this.stream.ended)
                        this.stream.abort()
                    this.stream = null
                }
            }
            this.log("INFO", "OpenAI: delete client")
            this.client = null
        }
        this.emit("close")
    }
}
