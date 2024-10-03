/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

/*  import external dependencies  */
import { EventEmitter } from "events"
import { Stream }       from "stream"
import OpenAI           from "openai"

/*  type of constructor options  */
export type ChatOptions = {
    apiToken: string,
    model:    string,
    prompt:   string
}

/*  type of text chunk  */
export type ChatChunk = {
    text:     string,
    final:    boolean
}

/*  Chat API class  */
export default class Chat extends EventEmitter {
    /*  default option values  */
    private options = {
        apiToken: "",
        model:    "gpt-4o-mini"
    } as ChatOptions

    /*  internal state  */
    private client: OpenAI | null = null
    private stream: Stream | null = null

    /*  API class constructor  */
    constructor (options: ChatOptions) {
        super()
        this.options.apiToken = options.apiToken
        this.options.model    = options.model
        this.options.prompt   = options.prompt
    }

    /*  minimum logging handling  */
    log (level: string, msg: string) {
        this.emit("log", level, msg)
    }

    /*  minimum fatal error handling  */
    error (reason: string | Error): never {
        const error = typeof reason === "string" ? new Error(reason) : reason
        this.emit("log", "ERROR", error.toString())
        throw error
    }

    /*  one-time initialization  */
    async init () {
    }

    /*  open Speech-to-Text engine  */
    async open () {
        this.client = new OpenAI({
            apiKey: this.options.apiToken,
            dangerouslyAllowBrowser: true
        })
        this.log("INFO", "OpenAI: ready for operation")
        this.emit("open")
    }

    async send (message: string) {
        if (this.client === null)
            return
        const stream = this.client.beta.chat.completions.stream({
            stream: true,
            model:  this.options.model,
            messages: [
                { role: "system", content: this.options.prompt },
                { role: "user",   content: message }
            ],
            seed: null,
            temperature: 0.90,
            n: 1,
            max_completion_tokens: 1000
        })
        stream.on("content", (delta, snapshot) => {
            this.emit("text", {
                text:  snapshot,
                final: false
            } as ChatChunk)
        })
        const completion = await stream.finalChatCompletion()
        const response = completion.choices[0].message.content
        this.emit("text", {
            text:  response,
            final: true
        } as ChatChunk)
        return response
    }

    /*  close Speech-to-Text engine  */
    async close () {
        this.emit("close")
    }

    /*  one-time destruction  */
    async destroy () {
        /*  no-op  */
    }
}
