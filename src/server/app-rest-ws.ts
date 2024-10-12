/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

import http                 from "node:http"
import ducky                from "ducky"
import * as HAPI            from "@hapi/hapi"
import Boom                 from "@hapi/boom"
import WebSocket            from "ws"
import Latching             from "latching"

import Log                  from "./app-util-log"
import REST                 from "./app-rest"
import { StateTypePartial } from "../common/app-common-state"
import { CommandType }      from "../common/app-common-command"

type wsPeerCtx = {
    id: string
}
type wsPeerInfo = {
    ctx:        wsPeerCtx
    ws:         WebSocket
    req:        http.IncomingMessage
    subscribed: Map<string, boolean>,
    peer:       string
}

export default class RESTWS extends Latching {
    /*  peer tracking  */
    private wsPeers = new Map<string, wsPeerInfo>()

    /*  creation  */
    constructor (
        private log:  Log,
        private rest: REST
    ) {
        super()
    }

    /*  initialization  */
    async init () {
        /*  serve WebSocket connections  */
        this.rest.server!.route({
            method: "POST",
            path:   "/ws/{peer}",
            options: {
                plugins: {
                    websocket: {
                        only: true,
                        autoping: 30 * 1000,

                        /*  on WebSocket connection open  */
                        connect: (args: any) => {
                            const ctx: wsPeerCtx            = args.ctx
                            const ws:  WebSocket            = args.ws
                            const req: http.IncomingMessage = args.req
                            const m = req.url!.match(/^\/ws\/(control|render)$/)
                            const peer = m !== null ? m[1] : "unknown"
                            const id = `${req.socket.remoteAddress}:${req.socket.remotePort}`
                            ctx.id = id
                            this.wsPeers.set(id, { ctx, ws, req, subscribed: new Map<string, boolean>(), peer })
                            this.log.log(2, `WebSocket: connect: remote=${id} peer=${peer}`)
                        },

                        /*  on WebSocket connection close  */
                        disconnect: (args: any) => {
                            const ctx: wsPeerCtx = args.ctx
                            const id = ctx.id
                            const peer = this.wsPeers.get(id)!.peer
                            this.wsPeers.delete(id)
                            this.log.log(2, `WebSocket: disconnect: remote=${id} peer=${peer}`)
                        }
                    }
                }
            },
            handler: (request: HAPI.Request, h: HAPI.ResponseToolkit) => {
                /*  on WebSocket message transfer  */
                const { ctx, ws } = request.websocket()
                if (typeof request.payload !== "object" || request.payload === null)
                    return Boom.badRequest("invalid request")
                if (!ducky.validate(request.payload, "{ cmd: string, arg?: any }"))
                    return Boom.badRequest("invalid request")
                const { cmd, arg } = request.payload as any satisfies { cmd: string, arg: any }
                if ((cmd === "SUBSCRIBE" || cmd === "UNSUBSCRIBE") && typeof arg === "string") {
                    if (cmd === "SUBSCRIBE")
                        this.wsPeers.get(ctx.id)!.subscribed.set(arg, true)
                    else
                        this.wsPeers.get(ctx.id)!.subscribed.delete(arg)
                }
                else if (cmd === "COMMAND") {
                    if (typeof arg === "object"
                        && typeof arg.cmd === "string"
                        && typeof arg.args === "object"
                        && arg.args instanceof Array) {
                        const command = arg as CommandType
                        this.notifyCommand(command, ctx.id)
                    }
                    else
                        return Boom.badRequest("invalid request")
                }
                else
                    return Boom.badRequest("unknown command")
                return h.response().code(204)
            }
        })
    }

    /*  notify clients about state change  */
    notifyState (state: StateTypePartial) {
        const msg = JSON.stringify({ cmd: "STATE", arg: { state } })
        for (const [ id, info ] of this.wsPeers.entries()) {
            this.log.log(3, `WebSocket: notify STATE: peer="${id} (${info.peer})" msg=${msg}`)
            if (info.ws.readyState === WebSocket.OPEN)
                info.ws.send(msg)
        }
    }

    /*  notify clients about command  */
    notifyCommand (command: CommandType, peer = "") {
        const msg = JSON.stringify({ cmd: "COMMAND", arg: { command } })
        for (const [ id, info ] of this.wsPeers.entries()) {
            if (peer !== "" && id === peer)
                continue
            this.log.log(3, `WebSocket: notify COMMAND: peer="${id} (${info.peer})" msg=${msg}`)
            if (info.ws.readyState === WebSocket.OPEN)
                info.ws.send(msg)
        }
    }
}

