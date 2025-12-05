/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

/*  external dependencies  */
import { EventEmitter }         from "events"
import OpenAI                   from "openai"
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
    apiToken:       string,
    model:          string,
    attachmentType: string,
    attachments:    Text2TextAttachment[],
    prompt:         string,
    temperature:    number,
    seed:           number,
    maxTokens:      number
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
        apiToken:       "",
        model:          "gpt-5-mini",
        attachmentType: "text",
        attachments:    [] as Text2TextAttachment[],
        prompt:         "",
        temperature:    1.0,
        seed:           1,
        maxTokens:      1000
    } as Text2TextOptions

    /*  name to use in front of OpenAI  */
    private namespace = "Studio AI"

    /*  internal state  */
    private client:     OpenAI                          | null   = null
    private documents:  OpenAI.Files.FileObject[]       | null   = null
    private store:      OpenAI.VectorStores.VectorStore | null   = null
    private responseId: string | null                            = null

    /*  API class constructor  */
    constructor (options: Text2TextOptions) {
        super()
        this.options.apiToken       = options.apiToken
        this.options.model          = options.model
        this.options.attachmentType = options.attachmentType
        this.options.attachments    = options.attachments
        this.options.prompt         = options.prompt
        this.options.temperature    = options.temperature
        this.options.seed           = options.seed
        this.options.maxTokens      = options.maxTokens
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
        this.log("ERROR", error.toString())
        throw error
    }

    /*  open Text-to-Text engine  */
    async open () {
        /*  create OpenAI client  */
        this.log("INFO", "OpenAI: create client")
        this.client = new OpenAI({
            dangerouslyAllowBrowser: true,
            apiKey:     this.options.apiToken,
            timeout:    30 * 1000,
            maxRetries: 2
        })

        /*  initialize initial dialog with system prompt  */
        const dialog: OpenAI.Responses.ResponseInput = []
        dialog.push({ role: "system", content: this.options.prompt })

        /*  handle attachments  */
        if (this.options.attachments.length > 0) {
            if (this.options.attachmentType === "file") {
                /*  synchronize local files with OpenAI platform files  */
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

                /*  create OpenAI platform vector store  */
                this.log("INFO", "OpenAI: retrieve (or create) vector store for Responses API")
                const stores: OpenAI.VectorStores.VectorStore[] = []
                const storesList = await this.client.vectorStores.list({ limit: 10 })
                for await (const page of storesList.iterPages())
                    page.getPaginatedItems().forEach((store) => { stores.push(store) })
                const store = stores.find((store) => store.name === `${this.namespace} Responses`)
                if (store !== undefined)
                    this.store = store
                if (this.store === null) {
                    this.store = await this.client.vectorStores.create({
                        name:          `${this.namespace} Responses`,
                        expires_after: { anchor: "last_active_at", days: 1 }
                    })
                }

                /*  synchronize OpenAI platform vector store with OpenAI platform files  */
                this.log("INFO", "OpenAI: synchronize vector store with uploaded files")
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
            }
            else if (this.options.attachmentType === "text") {
                /*  extract text from files and append to dialog  */
                const textExtract = new TextExtract()
                textExtract.on("log", (level: string, message: string) => {
                    this.log(level, `text extraction: ${message}`)
                })
                for (const attachment of this.options.attachments) {
                    const content = await textExtract.textExtract(attachment.name, attachment.data)
                    if (content !== "")
                        dialog.push({ role: "assistant", content })
                }
            }
        }

        /*  send initial request for system prompt and optionally attachment contents  */
        this.traffic({ send: true })
        this.responseId = null
        const response = await this.sendQuery(dialog, this.store)
        for await (const event of response) {
            this.traffic({ recv: true })
            if (event.type === "response.completed")
                this.responseId = event.response.id
        }
        if (this.responseId === null)
            this.error("failed to send initial OpenAI request")

        /*  communicate new state  */
        this.log("INFO", "OpenAI: ready for operation")
        this.emit("open")
    }

    /*  send a query to the OpenAI Responses API  */
    private async sendQuery (
        message: OpenAI.Responses.ResponseInput  | string,
        store:   OpenAI.VectorStores.VectorStore | null
    ) {
        if (this.client === null)
            this.error("OpenAI client not available")
        const response = await this.client.responses.create({
            stream:               true,
            model:                this.options.model,
            temperature:          this.options.model.endsWith("-mini") ? 1.0 : this.options.temperature,
            max_output_tokens:    this.options.maxTokens,
            ...(this.responseId !== null ? {
                previous_response_id: this.responseId
            } : {}),
            ...(this.options.model.startsWith("gpt-5") ? {
                reasoning: { effort: (store !== null ? "low" : (this.options.model.startsWith("gpt-5.1") ? "none" : "minimal")) },
            } : {}),
            ...(store !== null ? {
                tools: [ { type: "file_search", vector_store_ids: [ store.id ] } ]
            } : {}),
            input: message,
            store: true
        })
        return response
    }

    /*  send message to Text-to-Text engine and retrieve answer  */
    async send (message: string) {
        if (this.client === null)
            return
        this.traffic({ send: true })
        const response = await this.sendQuery(message, this.store)
        let fullText = ""
        for await (const event of response) {
            this.traffic({ recv: true })
            if (event.type === "response.output_text.delta") {
                fullText += event.delta
                this.emit("text", { text: fullText, final: false } as Text2TextChunk)
            }
            else if (event.type === "response.output_text.done") {
                fullText = event.text
                this.emit("text", { text: fullText, final: true } as Text2TextChunk)
            }
            else if (event.type === "response.completed")
                this.responseId = event.response.id
        }
    }

    /*  close Text-to-Text engine  */
    async close () {
        if (this.client !== null) {
            /*  delete vector store  */
            if (this.store !== null) {
                this.log("INFO", "OpenAI: delete vector store")
                await this.client.vectorStores.delete(this.store.id)
                this.store = null
            }

            /*  delete uploaded files  */
            if (this.documents !== null) {
                this.log("INFO", "OpenAI: delete uploaded files")
                for (const document of this.documents)
                    await this.client.files.delete(document.id)
                this.documents = null
            }

            /*  delete response id  */
            if (this.responseId !== null) {
                this.log("INFO", "OpenAI: delete response id")
                this.responseId = null
            }

            /*  delete client  */
            this.log("INFO", "OpenAI: delete client")
            this.client = null
        }

        /*  communicate new state  */
        this.log("INFO", "OpenAI: finished operation")
        this.emit("close")
    }
}
