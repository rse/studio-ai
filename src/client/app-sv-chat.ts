/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

/*  import external dependencies  */
import { EventEmitter }       from "events"

/*  type of constructor options  */
export type ChatOptions = {
    apiToken: string,
    model:    string
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

    /*  API class constructor  */
    constructor (options: ChatOptions) {
        super()
        this.options.apiToken = options.apiToken
        this.options.model    = options.model
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
        this.log("INFO", "OpenAI: ready for operation")
    }

    /*  close Speech-to-Text engine  */
    async close () {
    }

    /*  one-time destruction  */
    async destroy () {
        /*  no-op  */
    }
}
