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
        <div v-show="debug !== ''" class="debug">
            {{ debug }}
        </div>
        <div v-show="overlayShow" class="overlay">
            <div class="box">
                <img class="logo" src="../../res/app-icon.svg" alt=""/>
                <div class="name"><span class="name1">Studio</span> <span class="name2">AI</span></div>
                <div class="vers">{{ pkg.version }} ({{ pkg["x-date"] }})</div>
            </div>
            <div class="spin">
                <i class="fa-solid fa-spinner fa-spin"></i>
            </div>
            <div class="text">{{ overlayText }}</div>
        </div>
        <div v-show="fpsOverlayEnable && fps === 0" class="mask">
            <div class="box">
                <div class="icon">
                    <i class="fas fa-circle-pause"></i>
                </div>
                <div class="text1">RENDERING PAUSED</div>
                <div class="text2">(not in preview or program)</div>
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
    .debug
        position: absolute
        top: 0
        left: 0
        width: 100%
        text-align: center
        background-color: #cc333380
        color: #fff
        font-size: 3vw
        word-wrap: break-word
    .overlay
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background-color: var(--color-std-bg-1)
        color: var(--color-std-fg-3)
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        .box
            display: flex
            flex-direction: column
            align-items: center
            justify-content: center
            border-radius: 2.5vw
            background-color: var(--color-std-bg-3)
            padding: 1.5vw
            margin-bottom: 2vw
            .logo
                width: 15vw
                margin-bottom: 1vw
            .name
                font-size: 2vw
                font-weight: bold
                .name1
                    color: var(--color-std-fg-3)
                .name2
                    color: var(--color-std-fg-5)
            .vers
                font-size: 1.5vw
                font-weight: 200
                color: var(--color-std-fg-1)
        .spin
            font-size: 5vw
            color: var(--color-acc-fg-3)
            margin-bottom: 1vw
        .text
            font-size: 2vw
            color: var(--color-acc-fg-3)
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
    StateType, StateTypePartial,
    StateSchema, StateSchemaPartial,
    StateDefault, StateUtil
} from "../common/app-state"
import {
    CommandType, CommandSchema
} from "../common/app-command"
import Text2Speech from "./app-sv-text2speech"
</script>

<script lang="ts">
let debugTimer: ReturnType<typeof setTimeout> | null = null
let text2speech: Text2Speech | null = null
const commandBus = new EventEmitter()
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
        debug: "",
        state: StateDefault,
        overlayShow: false,
        overlayText: "",
        fpsOverlayEnable: false,
        fps: 30,
        connected: false
    }),
    created () {
        this.log("INFO", `starting ${pkg.name} ${pkg.version} (${pkg["x-date"]})`)
    },
    async mounted () {
        /*  establish renderer  */
        this.log("INFO", "establish Babylon game engine")
        this.overlay("establish HeyGen avatar")
        this.overlayShow = true

        /*  load scene state once  */
        this.log("INFO", "initially configuring Studio AI")
        this.overlay("initially configuring Studio AI")
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
        this.log("INFO", "establish WebSocket server connection")
        this.overlay("establish WebSocket server connection")
        const ws = new RecWebSocket(this.wsUrl + "/render", [], {
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
                this.log("INFO", `received command "${command.cmd}" ` +
                    `(args: ${command.args.length > 0 ? command.args.map((arg) => JSON.stringify(arg)).join(", ") : "none"})`)
                commandBus.emit(command.cmd, ...command.args)
            }
            else
                this.log("WARNING", `unknown message received: cmd=${data.cmd} ${JSON.stringify(data)}`)
        })
        this.overlayShow = false

        /*  establish Text-to-Speech engine  */
        this.log("INFO", "establishing Text-to-Speech engine")
        text2speech = new Text2Speech({
            apiToken:     this.state.text2speech.heygenApiToken,
            avatarId:     this.state.text2speech.heygenAvatarId,
            quality:      this.state.text2speech.heygenQuality,
            voiceId:      this.state.text2speech.heygenVoiceId,
            rate:         this.state.text2speech.heygenRate,
            emotion:      this.state.text2speech.heygenEmotion,
            language:     this.state.text2speech.heygenLanguage,
            ckEnable:     this.state.text2speech.ckEnable,
            ckThreshold:  this.state.text2speech.ckThreshold,
            ckSmoothing:  this.state.text2speech.ckSmoothing,
            device:       this.state.text2speech.speakerDevice,
            video:        this.$refs.video as HTMLVideoElement
        })
        await text2speech.init()
        text2speech.on("log", (level: string, msg: string) => {
            this.log(level, `Text-to-Speech: ${msg}`)
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
        commandBus.on("t2s:open", () => {
            text2speech!.open()
        })
        commandBus.on("t2s:close", () => {
            text2speech!.close()
        })
        commandBus.on("t2s:speak", (request: { text: string }) => {
            text2speech!.speak(request.text)
        })
    },
    methods: {
        log (level: string, msg: string) {
            const timestamp = moment().format("YYYY-MM-DD hh:mm:ss.SSS")
            console.log(`${timestamp} [${level}]: ${msg}`)
        },

        overlay (msg: string) {
            this.overlayText = msg
        },

        setDebug (msg: string) {
            this.debug = msg
            if (debugTimer !== null)
                clearTimeout(debugTimer)
            debugTimer = setTimeout(() => { this.debug = "" }, 4000)
        },

        /*  send command  */
        async sendCommand (cmd: string, args = [] as any[] ) {
            await axios({
                method: "POST",
                url:    `${this.serviceUrl}command`,
                data:   { cmd, args }
            }).finally(() => {
            })
        }
    }
})
</script>

