<!--
**
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
**
-->

<template>
    <div class="app-render">
        <div class="screen">
            <div class="avatar">
                <div v-show="connected" class="video">
                    <video v-show="connected" ref="video" playsinline autoplay muted>
                        <track kind="captions"/>
                    </video>
                </div>
                <div v-show="!connected" class="icon">
                    <spinner-grid class="spinner-grid" size="128"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="stylus">
.app-render
    top:    0
    left:   0
    width:  100vw
    height: 100vh
    position: relative
    display: flex
    flex-direction: row
    justify-content: center
    align-items: flex-end
    .screen
        .avatar
            width: 100%
            height: auto
            aspect-ratio: 16/9
            display: flex
            flex-direction: row
            justify-content: center
            align-items: flex-end
            .video
                width: 100%
                height: auto
                aspect-ratio: 16/9
                display: flex
                flex-direction: row
                justify-content: center
                align-items: flex-end
                video
                    width:  100%
                    height: 100%
                    touch-action: none
                    border: 0
                    outline: none
                    object-fit: contain
            .icon
                width: 100%
                height: 100%
                color: #f0f0f0
                display: flex
                flex-direction: row
                justify-content: center
                align-items: center
    .mask
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background-color: var(--color-acc-bg-1)
        color: var(--color-acc-fg-3)
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        opacity: 0.75
        .box
            display: flex
            flex-direction: column
            align-items: center
            justify-content: center
            border-radius: 1vw
            padding: 2vw
            color: var(--color-acc-fg-5)
            text-align: center
            .icon
                font-size: 16vw
            .text1
                font-size: 4vw
                font-weight: bold
            .text2
                font-size: 3vw

@media screen and (max-aspect-ratio: 16/9)
    .app-render
        .screen
            width: 100vw
            height: auto
            aspect-ratio: 16/9

@media screen and (aspect-ratio: 1/1)
    .app-render
        .screen
            width: 100vw
            height: auto
            aspect-ratio: 16/9

@media screen and (min-aspect-ratio: 16/9)
    .app-render
        .screen
            width: auto
            height: 100vh
            aspect-ratio: 16/9
</style>

<script setup lang="ts">
// @ts-ignore
import pkg                        from "../../package.json"
import { defineComponent }        from "vue"
import { EventEmitter }           from "events"
import RecWebSocket               from "@opensumi/reconnecting-websocket"
import Ducky                      from "ducky"
import moment                     from "moment"
import axios                      from "axios"
import { VueSpinnerGrid }         from "vue3-spinners"
import {
    StateTypePartial,
    StateSchema, StateSchemaPartial,
    StateDefault, StateUtil
} from "../common/app-common-state"
import {
    CommandType,
    CommandSchema
} from "../common/app-common-command"
import Text2Speech from "./app-sv-text2speech"
</script>

<script lang="ts">
let text2speech: Text2Speech | null = null
const commandBus = new EventEmitter()
let ws: RecWebSocket | null = null
export default defineComponent({
    name: "app-render",
    components: {
        "spinner-grid": VueSpinnerGrid
    },
    props: {
        options:    { type: Object, default: new Map<string, string | boolean>() },
        serviceUrl: { type: String, default: "" },
        wsUrl:      { type: String, default: "" }
    },
    data: () => ({
        state: StateDefault,
        connected: false
    }),
    created () {
        this.log("INFO", `starting ${pkg.name} ${pkg.version} (${pkg["x-date"]}) <${pkg.homepage}> client (RENDER mode)`)
    },
    async mounted () {
        /*  load state once  */
        this.log("INFO", "initially configuring Studio AI")
        const state = await axios({
            method: "GET",
            url:    `${this.serviceUrl}state`
        }).then((response) => response.data).catch(() => null)
        if (state === null)
            throw new Error("failed to load state")
        const errors = [] as Array<string>
        if (!Ducky.validate(state, StateSchema, errors))
            throw new Error(`invalid schema of loaded state: ${errors.join(", ")}`)
        this.state = state

        /*  connect to server for state updates  */
        this.log("INFO", "establish WebSocket connection to server")
        ws = new RecWebSocket(this.wsUrl + "/render", [], {
            reconnectionDelayGrowFactor: 1.3,
            maxReconnectionDelay:        4000,
            minReconnectionDelay:        1000,
            connectionTimeout:           4000,
            minUptime:                   5000
        })
        let opened = 0
        ws.addEventListener("open", (ev) => {
            if (opened++ > 0)
                this.log("INFO", "re-established WebSocket server connection")
        })
        ws.addEventListener("error", (ev) => {
            this.log("WARNING", "WebSocket server connection error")
        })
        ws.addEventListener("message", (ev: MessageEvent) => {
            if (typeof ev.data !== "string") {
                this.log("WARNING", "invalid WebSocket server message received")
                return
            }
            const data: any = JSON.parse(ev.data)
            if (!(typeof data === "object" && typeof data.cmd === "string" && data.arg !== undefined))
                this.log("WARNING", "invalid WebSocket server message received")
            else if (data.cmd === "STATE") {
                const state = data.arg.state as StateTypePartial
                const errors = [] as Array<string>
                if (!Ducky.validate(state, StateSchemaPartial, errors)) {
                    this.log("WARNING", `invalid schema of loaded state: ${errors.join(", ")}`)
                    return
                }
                StateUtil.copy(this.state, state)
            }
            else if (data.cmd === "COMMAND") {
                const command = data.arg.command as CommandType
                const errors = [] as Array<string>
                if (!Ducky.validate(command, CommandSchema, errors)) {
                    this.log("WARNING", `invalid schema of command: ${errors.join(", ")}`)
                    return
                }
                commandBus.emit(command.cmd, ...command.args)
            }
            else
                this.log("WARNING", `unknown message received: cmd=${data.cmd} ${JSON.stringify(data)}`)
        })

        /*  establish Text-to-Speech engine  */
        this.log("INFO", "preparing T2S engine")
        const establishText2Speech = async (recreating: boolean) => {
            this.log("INFO", `T2S: ${recreating ? "re" : ""}establishing T2S engine`)
            const reOpen = this.connected
            if (recreating)
                await text2speech?.close()
            text2speech = new Text2Speech({
                apiToken:     this.state.text2speech.heygenApiToken,
                avatar:       this.state.text2speech.heygenAvatar,
                language:     this.state.text2speech.heygenLanguage,
                ckEnable:     this.state.text2speech.ckEnable,
                ckThreshold:  this.state.text2speech.ckThreshold,
                ckSmoothing:  this.state.text2speech.ckSmoothing,
                device:       this.state.text2speech.speakerDevice,
                video:        this.$refs.video as HTMLVideoElement
            })

            /*  react on Text-to-Speech engine events  */
            text2speech.on("log", (level: string, msg: string) => {
                this.log(level, `T2S: ${msg}`)
            })
            text2speech.on("traffic", (flags: { send?: boolean, recv?: boolean }) => {
                this.sendCommand("t2s:traffic", [ flags ])
            })
            text2speech.on("open", () => {
                this.sendCommand("t2s:opened")
                this.connected = true
            })
            text2speech.on("reconnect", () => {
                this.sendCommand("t2s:reconnecting")
                this.connected = false
            })
            text2speech.on("close", () => {
                this.sendCommand("t2s:closed")
                this.connected = false
            })
            text2speech.on("speak:start", () => {
                this.sendCommand("t2s:speak:start")
            })
            text2speech.on("speak:stop", () => {
                this.sendCommand("t2s:speak:stop")
            })

            /*  optionally re-open connection on re-creation  */
            if (reOpen)
                text2speech.open()
        }
        await establishText2Speech(false)
        this.$watch("state.text2speech", () => {
            this.log("INFO", "T2S: reconfiguration detected")
            establishText2Speech(true)
        }, { deep: true })

        /*  react on command events  */
        commandBus.on("t2s:open", () => {
            text2speech?.open()
        })
        commandBus.on("t2s:close", () => {
            text2speech?.close()
        })
        commandBus.on("t2s:speak", (request: { text: string }) => {
            text2speech?.speak(request.text)
        })
        commandBus.on("t2s:interrupt", () => {
            text2speech?.interrupt()
        })
    },
    methods: {
        /*  minimum logging facility  */
        log (level: string, msg: string) {
            const timestamp = moment().format("YYYY-MM-DD hh:mm:ss.SSS")
            const levelStr = `[${level}]:     `.substring(0, 10)
            console.log(`${timestamp} ${levelStr} ${msg}`)
            this.sendCommand("render:log", [ level, msg ])
        },

        /*  send command  */
        async sendCommand (cmd: string, args = [] as any[] ) {
            if (ws === null)
                return
            const msg = JSON.stringify({ cmd: "COMMAND", arg: { cmd, args } })
            if (ws.readyState === RecWebSocket.OPEN)
                ws.send(msg)
        }
    }
})
</script>

