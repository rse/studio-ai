/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

import * as HAPI       from "@hapi/hapi"

import REST            from "./app-rest"
import RESTWS          from "./app-rest-ws"
import { CommandType, CommandSchema } from "../common/app-common-command"

export default class RESTCommand {
    constructor (
        private rest:   REST,
        private restWS: RESTWS
    ) {}
    async init () {
        /*  send command  */
        this.rest.server!.route({
            method: "POST",
            path: "/command",
            options: {
                payload: {
                    output: "data",
                    parse:  true,
                    allow:  "application/json"
                },
                plugins: {
                    ducky: CommandSchema
                }
            },
            handler: async (req: HAPI.Request, h: HAPI.ResponseToolkit) => {
                const command = req.payload as CommandType
                this.restWS.notifyCommand(command)
                return h.response().code(204)
            }
        })

        /*  send command (alternative)  */
        this.rest.server!.route({
            method: "GET",
            path: "/command/{command*}",
            handler: async (req: HAPI.Request, h: HAPI.ResponseToolkit) => {
                const command = req.params.command.split(/\//)
                const cmd = { cmd: command[0], args: command.slice(1) } satisfies CommandType
                this.restWS.notifyCommand(cmd)
                return h.response().code(204)
            }
        })
    }
}

