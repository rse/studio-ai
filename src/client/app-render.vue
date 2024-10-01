<!--
**
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
**
-->

<template>
    <div class="app-render">
        <canvas ref="canvas"></canvas>
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
    position: relative
    canvas
        top: 0
        left: 0
        width: 100vw
        height: 100vh
        touch-action: none
        border: 0
        outline: none
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
</style>

<script setup lang="ts">
// @ts-ignore
import pkg                        from "../../package.json"
import { defineComponent }        from "vue"
import RecWebSocket               from "@opensumi/reconnecting-websocket"
import Ducky                      from "ducky"
import moment                     from "moment"
import axios                      from "axios"
import {
    StateType, StateTypePartial,
    StateSchema, StateSchemaPartial,
    StateDefault, StateUtil
} from "../common/app-state"
</script>

<script lang="ts">
let debugTimer: ReturnType<typeof setTimeout> | null = null
export default defineComponent({
    name: "app-render",
    components: {},
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
        fps: 30
    }),
    created () {
        this.log("INFO", `starting ${pkg.name} ${pkg.version} (${pkg["x-date"]})`)
    },
    async mounted () {
        /*  establish renderer  */
        this.log("INFO", "establish Babylon game engine")
        this.overlay("establish HeyGen avatar")
        this.overlayShow = true
        const video = this.$refs.video as HTMLVideoElement

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
            else
                this.log("WARNING", `unknown message received: cmd=${data.cmd} ${JSON.stringify(data)}`)
        })
        this.overlayShow = false
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
        }
    }
})
</script>

