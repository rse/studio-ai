/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

import path            from "node:path"
import fs              from "node:fs"
import { Readable }    from "node:stream"
import * as HAPI       from "@hapi/hapi"
import Boom            from "@hapi/boom"
import { glob }        from "glob"

import Argv            from "./app-util-argv"
import REST            from "./app-rest"

export default class RESTAttachment {
    constructor (
        private argv: Argv,
        private rest: REST
    ) {}
    async init () {
        /*  get number of attachments  */
        this.rest.server!.route({
            method: "GET",
            path: "/attachment/count",
            handler: async (req: HAPI.Request, h: HAPI.ResponseToolkit) => {
                const files = await glob("studio-ai-attachment-*.txt",
                    { cwd: this.argv.stateDir, absolute: true })
                return h.response({ count: files.length }).code(200)
            }
        })

        /*  get filenames of attachments  */
        this.rest.server!.route({
            method: "GET",
            path: "/attachment/filenames",
            handler: async (req: HAPI.Request, h: HAPI.ResponseToolkit) => {
                const files = await glob("studio-ai-attachment-*.txt",
                    { cwd: this.argv.stateDir, absolute: true })
                const filenames = [] as string[]
                for (const file of files) {
                    let filename = await fs.promises.readFile(file, { encoding: "utf8" })
                    filename = filename.replace(/\r?\n$/, "")
                    filenames.push(filename)
                }
                return h.response({ filenames }).code(200)
            }
        })

        /*  upload new attachments  */
        this.rest.server!.route({
            method: "POST",
            path: "/attachment",
            options: {
                payload: {
                    parse:     true,
                    allow:     "multipart/form-data",
                    maxBytes:  100 * 1024 * 1024,
                    multipart: { output: "stream" }
                }
            },
            handler: async (req: HAPI.Request, h: HAPI.ResponseToolkit) => {
                /*  extract additional attachments from upload request  */
                const data = req.payload as any
                const files = await glob("studio-ai-attachment-*.txt",
                    { cwd: this.argv.stateDir, absolute: true })
                let i = files.length
                for (const key of Object.keys(data)) {
                    if (key.match(/^attachment-\d+$/) !== null) {
                        let name = (data[key].hapi?.filename as string) ?? key
                        name = name.replace(/[^A-Za-z0-9-.]+/g, "-").replace(/--+/g, "-")

                        /*  store name of attachment  */
                        const filename1 = path.join(this.argv.stateDir, `studio-ai-attachment-${i}.txt`)
                        await fs.promises.writeFile(filename1, `${name}\n`, { encoding: "utf8" })

                        /*  store content of attachment  */
                        const filename2 = path.join(this.argv.stateDir, `studio-ai-attachment-${i}.bin`)
                        const input = data[key] as Readable
                        const output = fs.createWriteStream(filename2, { flags: "w" })
                        input.pipe(output)
                        await new Promise<void>((resolve, reject) => {
                            output.on("finish", () => {
                                resolve()
                            })
                            output.on("error", (err: Error) => {
                                reject(new Error(`Error writing attachment file #${i}: ${err}`))
                            })
                        })
                        i++
                    }
                }
                return h.response().code(201)
            }
        })

        /*  fetch one attachment  */
        this.rest.server!.route({
            method: "GET",
            path: "/attachment/{i}",
            handler: async (req: HAPI.Request, h: HAPI.ResponseToolkit) => {
                const i = req.params.i
                const filename1 = await glob(`studio-ai-attachment-${i}.txt`,
                    { cwd: this.argv.stateDir, absolute: true })
                if (filename1.length !== 1)
                    return Boom.badRequest("invalid request")
                if (!await (fs.promises.stat(filename1[0]).then(() => true).catch(() => false)))
                    return Boom.badRequest("invalid request")
                const filename2 = await glob(`studio-ai-attachment-${i}.bin`,
                    { cwd: this.argv.stateDir, absolute: true })
                if (filename2.length !== 1)
                    return Boom.badRequest("invalid request")
                if (!await (fs.promises.stat(filename2[0]).then(() => true).catch(() => false)))
                    return Boom.badRequest("invalid request")
                let filename = await fs.promises.readFile(filename1[0], { encoding: "utf8" })
                filename = filename.replace(/\r?\n$/, "")
                filename = filename.replace(/["\\]/g, "_")
                return h.file(filename2[0], { confine: false })
                    .type("application/octet-stream")
                    .header("content-disposition", `attachment; filename="${filename}"`)
            }
        })

        /*  remove all attachments  */
        this.rest.server!.route({
            method: "GET",
            path: "/attachment/clear",
            handler: async (req: HAPI.Request, h: HAPI.ResponseToolkit) => {
                const files = await glob("studio-ai-attachment-*.*",
                    { cwd: this.argv.stateDir, absolute: true })
                for (const file of files)
                    await fs.promises.unlink(file)
                return h.response().code(204)
            }
        })
    }
}

