<!--
**
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
**
-->

<template>
    <div class="app-control">
        <!--  HEADER  -->
        <div class="head">
            <img class="logo" src="../../res/app-icon.svg" alt="" />
            <b>Studio AI</b> Control
        </div>

        <!--  BODY  -->
        <div class="body">
            <tabs ref="tabs" v-bind:options="{ useUrlFragment: false }" v-bind:cache-lifetime="0" class="tabs-level-1" v-on:changed="tabChanged">
                <!--  ==== SETTINGS ====  -->
                <tab id="settings" name="Settings">
                    <div class="desc">
                        The <b>Settings</b> are the configuration settings of this application.
                    </div>
                    <div class="control">
                        <div class="label1">deepgram</div>
                        <div class="label2">(microphone)</div>
                        <div class="label3">[device]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.speech2text.microphoneDevice = stateDefault.speech2text.microphoneDevice">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.speech2text.microphoneDevice"/>
                        </div>

                        <div class="label1">deepgram</div>
                        <div class="label2">(API)</div>
                        <div class="label3">[token]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.speech2text.deepgramApiToken = stateDefault.speech2text.deepgramApiToken">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.speech2text.deepgramApiToken"/>
                        </div>

                        <div class="label1">deepgram</div>
                        <div class="label2">(model)</div>
                        <div class="label3">[id]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.speech2text.deepgramModel = stateDefault.speech2text.deepgramModel">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.speech2text.deepgramModel"/>
                        </div>

                        <div class="label1">openai</div>
                        <div class="label2">(API)</div>
                        <div class="label3">[token]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.chat.openaiApiToken = stateDefault.chat.openaiApiToken">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.chat.openaiApiToken"/>
                        </div>

                        <div class="label1">openai</div>
                        <div class="label2">(model)</div>
                        <div class="label3">[id]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.chat.openaiModel = stateDefault.chat.openaiModel">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.chat.openaiModel"/>
                        </div>

                        <div class="label1">openai</div>
                        <div class="label2">(prompt)</div>
                        <div class="label3">[string]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.chat.openaiPrompt = stateDefault.chat.openaiPrompt">RESET</div>
                        <div class="input">
                            <textarea class="prompt" rows="10" v-model.lazy="state.chat.openaiPrompt"></textarea>
                        </div>

                        <div class="label1">heygen</div>
                        <div class="label2">(API)</div>
                        <div class="label3">[token]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.text2speech.heygenApiToken = stateDefault.text2speech.heygenApiToken">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.text2speech.heygenApiToken"/>
                        </div>

                        <div class="label1">heygen</div>
                        <div class="label2">(avatar)</div>
                        <div class="label3">[id]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.text2speech.heygenAvatarId = stateDefault.text2speech.heygenAvatarId">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.text2speech.heygenAvatarId"/>
                        </div>

                        <div class="label1">heygen</div>
                        <div class="label2">(quality)</div>
                        <div class="label3">[level]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.text2speech.heygenQuality = stateDefault.text2speech.heygenQuality">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.text2speech.heygenQuality"/>
                        </div>

                        <div class="label1">heygen</div>
                        <div class="label2">(voice)</div>
                        <div class="label3">[id]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.text2speech.heygenVoiceId = stateDefault.text2speech.heygenVoiceId">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.text2speech.heygenVoiceId"/>
                        </div>

                        <div class="label1">heygen</div>
                        <div class="label2">(emotion)</div>
                        <div class="label3">[type]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.text2speech.heygenEmotion = stateDefault.text2speech.heygenEmotion">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.text2speech.heygenEmotion"/>
                        </div>

                        <div class="label1">heygen</div>
                        <div class="label2">(speaker)</div>
                        <div class="label3">[device]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.text2speech.speakerDevice = stateDefault.text2speech.speakerDevice">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.text2speech.speakerDevice"/>
                        </div>
                    </div>
                </tab>

                <!--  ==== CONTROL ====  -->
                <tab id="control" name="Control" class="controlx">
                    <div class="desc">
                        The <b>Control</b> is your panel for run-time control of the interactive AI avatar.
                    </div>
                    <div class="control">
                        <div class="dialog">
                            FIXME
                        </div>
                        <textarea class="avatar">FIXME</textarea>
                        <textarea class="audience">FIXME</textarea>
                        <div class="button" v-on:click="void(0)">Speech-to-Text</div>
                    </div>
                </tab>

                <!--  ==== PREVIEW ====  -->
                <tab id="preview" name="Preview" class="preview">
                    <div class="desc">
                        The <b>Preview</b> is a preview of the interactive AI avatar.
                        It is exactly the same content intended to be loaded into the <b>vMix</b> Browser input
                        or <b>OBS Studio</b> Browser source and allows you to preview the avatar in the browser here, too.
                    </div>
                    <div class="preview-url" v-on:click="previewCopy()">
                        {{ `${serviceUrl}#/render` }}
                    </div>
                    <div class="preview-control">
                        <div class="action">
                            <div class="button" v-on:click="previewOpen()">OPEN</div>
                            <div class="button" v-on:click="previewCopy()">COPY</div>
                        </div>
                    </div>
                </tab>
            </tabs>
        </div>

        <!--  FOOTER  -->
        <div class="foot" v-bind:class="{
            error:   status.kind === 'error',
            warning: status.kind === 'warning',
            info:    status.kind === 'info'
        }">
            <!--  Application Status Information  -->
            <div class="status">
                {{ status.kind === '' ? `${pkg.name} ${pkg.version} (${pkg["x-date"]})` : status.msg }}
            </div>

            <!--  Server Connection Information  -->
            <div class="connection">
                <!--  Online  -->
                <div class="online yes" v-show="connection.online">
                    <i class="fa-solid fa-plug-circle-check"></i>
                </div>
                <div class="online no" v-show="!connection.online">
                    <i class="fa-solid fa-plug-circle-xmark"></i>
                </div>

                <!--  Traffic Send  -->
                <div class="traffic send" v-bind:class="{ active: connection.send }">
                    <i class="fa-solid fa-circle"></i>
                </div>

                <!--  Traffic Recv  -->
                <div class="traffic recv" v-bind:class="{ active: connection.recv }">
                    <i class="fa-solid fa-circle"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="stylus">
.app-control
    width:  100vw
    height: 100vh
    min-width: 900px
    min-height: 600px
    overflow: hidden
    margin: 0
    padding: 0
    display: flex
    flex-direction: column
    justify-items: center
    align-items: center
    .head
        background-color: var(--color-std-bg-1)
        color: var(--color-std-fg-1)
        padding: 10px 40px
        width:  calc(100% - 2 * 40px)
        height: 20px
        font-weight: 200
        font-size: 20px
        line-height: 20px
        position: relative
        .logo
            position: relative
            top: 2px
            height: 20px
            margin-right: 10px
    .body
        flex-grow: 1
        background-color: var(--color-std-bg-0)
        color: var(--color-std-fg-5)
        padding: 10px 10px
        width:  calc(100% - 2 * 10px)
        height: calc(100% - 2 * 10px)
        overflow: hidden
    .foot
        background-color: var(--color-std-bg-1)
        color: var(--color-std-fg-1)
        padding: 13px 40px
        width:  calc(100% - 2 * 40px)
        height: 14px
        font-weight: 200
        font-size: 14px
        line-height: 14px
        display: flex
        flex-direction: row
        justify-items: center
        align-items: center
        &.info
            font-weight: normal
            background-color: var(--color-std-bg-5)
            color: var(--color-std-fg-5)
        &.warning
            font-weight: bold
            background-color: var(--color-acc-bg-3)
            color: var(--color-acc-fg-5)
        &.error
            font-weight: bold
            background-color: var(--color-sig-bg-3)
            color: var(--color-sig-fg-5)
        .status
            flex-grow: 1
        .connection
            border: 1px solid var(--color-std-bg-3)
            background-color: var(--color-std-bg-2)
            border-radius: 4px
            padding: 4px 8px 4px 8px
            display: flex
            flex-direction: row
            justify-items: center
            align-items: center
            .online
                margin-right: 8px
                &.yes
                    color: var(--color-std-fg-1)
                &.no
                    color: var(--color-sig-fg-1)
            .traffic
                &.send
                    margin-right: 4px
                    color: var(--color-std-fg-1)
                    &.active
                        color: var(--color-sig-fg-1)
                &.recv
                    color: var(--color-std-fg-1)
                    &.active
                        color: var(--color-acc-fg-1)
    .tabs-component
        height: 100%
        display: flex
        flex-direction: column
        justify-items: flex-start
        align-items: flex-start
    .tabs-component-panels
        flex-grow: 1
        display: flex
        flex-direction: column
        justify-items: flex-start
        align-items: flex-start
    .tabs-component-panel
        flex-grow: 1
        display: flex
        flex-direction: column
        justify-items: flex-start
        align-items: flex-start
        width: 100%
    .tabs-component-tab-a
        padding: 2px 4px 2px 4px
        font-size: 11pt
    .desc
        font-weight: 200
        color: var(--color-std-fg-3)
        margin-bottom: 20px
        b
            font-weight: normal
    .control
        display: grid
        grid-template-columns: auto auto auto 7vw auto auto
        grid-template-rows: auto
        justify-content: center
        align-items: start
        gap: 10px 10px
        .label1,
        .label2,
        .label3
            white-space: nowrap
        .label1
            color: var(--color-acc-fg-5)
            width: 100px
        .label2
            width: 110px
        .label3
            font-weight: 200
            width: 80px
        .value
            justify-self: end
            input
                width: 60px
                font-size: 12pt
                font-weight: bold
                outline: none
                border-radius: 4px
                border: 0
                background-color: var(--color-acc-bg-3)
                color: var(--color-acc-fg-4)
                padding: 4px 8px 4px 8px
                text-align: right
                &:focus
                    background-color: var(--color-acc-bg-4)
                    color: var(--color-acc-fg-5)
            .fixed
                width: 60px
                font-size: 12pt
                font-weight: normal
                outline: none
                border-radius: 4px
                border: 0
                background-color: var(--color-acc-bg-1)
                color: var(--color-acc-fg-1)
                padding: 2px 8px 2px 8px
                text-align: center
        .button
            background-color: var(--color-std-bg-4)
            color: var(--color-std-fg-5)
            border-radius: 4px
            padding: 2px 8px 2px 8px
            min-height: 20px
            text-align: center
            font-size: 10pt
            font-weight: 200
            cursor: pointer
            &:hover
                background-color: var(--color-acc-bg-4)
                color: var(--color-acc-fg-5)
        input.text
            background-color: var(--color-acc-bg-3)
            color: var(--color-acc-fg-5)
            border: 0
            border-radius: 4px
            padding: 6px 12px 6px 12px
            outline: none
            font-weight: bold
            font-size: 12pt
            width: calc(400px - 2 * 12px)
            &:focus
                background-color: var(--color-acc-bg-4)
                color: var(--color-acc-fg-5)
            &:hover
                background-color: var(--color-acc-bg-5)
                color: var(--color-acc-fg-5)
        textarea
            background-color: var(--color-acc-bg-3)
            color: var(--color-acc-fg-5)
            border: 0
            border-radius: 4px
            padding: 6px 12px 6px 12px
            outline: none
            font-weight: bold
            font-size: 12pt
            width: calc(400px - 2 * 12px)
            &.prompt
                font-size: 10pt
                font-weight: normal
    .preview
        .preview-control
            margin-top: 20px
            display: flex
            flex-direction: row
            justify-items: flex-start
            align-items: center
            .action
                display: grid
                grid-template-columns: 70px 70px
                grid-template-rows: 40px
                justify-items: center
                align-items: center
                gap: 10px 10px
            .button
                background-color: var(--color-std-bg-3)
                color: var(--color-std-fg-3)
                border-radius: 4px
                padding: 2px 8px 2px 8px
                text-align: center
                font-size: 12pt
                line-height: 40px
                width: calc(100% - 2 * 8px)
                height: calc(100% - 2 * 2px)
                cursor: pointer
                &.selected
                    background-color: var(--color-acc-bg-3)
                    color: var(--color-acc-fg-3)
                &:hover
                    background-color: var(--color-acc-bg-5)
                    color: var(--color-acc-fg-5)
        .preview-url
            background-color: var(--color-acc-bg-3)
            color: var(--color-acc-fg-5)
            border-radius: 4px
            padding: 8px 8px 8px 8px
            font-size: 12pt
            width: auto
            height: auto
    .input
        width: 400px
    .slider
        width: 400px
        --slider-bg: var(--color-std-bg-2)
        --slider-handle-bg: var(--color-std-fg-5)
        --slider-connect-bg: var(--color-acc-bg-5)
        --slider-height: 20px
        --slider-handle-width: 20px
        --slider-handle-height: 20px
        --slider-tooltip-bg: var(--color-std-fg-5)
        --slider-tooltip-color: var(--color-std-bg-2)
        --slider-tooltip-font-size: 10pt
        --slider-tooltip-line-height: 12pt
        --slider-tooltip-font-weight: normal
        --slider-tooltip-radius: 4px
        --slider-tooltip-arrow-size: 8px
        --slider-tooltip-min-width: 40px
    .toggle
        --toggle-width: 60px
        --toggle-height: 20px
        --toggle-border: 0
        --toggle-bg-on: var(--color-acc-bg-5)
        --toggle-bg-off: var(--color-std-bg-2)
        --toggle-ring-width: 0
        --toggle-handle-enabled: var(--color-std-fg-5)
    .radios
        display: flex
        flex-direction: row
        justify-items: center
        align-items: center
        .button
            margin-right: 4px
            &.selected
                background-color: var(--color-acc-bg-3)
                color: var(--color-acc-fg-5)
            &:hover
                background-color: var(--color-acc-bg-5)
                color: var(--color-acc-fg-5)
</style>

<script setup lang="ts">
// @ts-ignore
import pkg                 from "../../package.json"
import { defineComponent } from "vue"
import RecWebSocket        from "@opensumi/reconnecting-websocket"
import Ducky               from "ducky"
import Slider              from "@vueform/slider"
import Toggle              from "@vueform/toggle"
import axios               from "axios"
import PerfectScrollbar    from "perfect-scrollbar"
import { Tabs, Tab }       from "vue3-tabs-component"
import {
    StateType, StateTypePartial,
    StateSchema, StateSchemaPartial,
    StateDefault,
    StatePaths,
    StateUtil
} from "../common/app-state"
</script>

<script lang="ts">
let statusTimer: ReturnType<typeof setTimeout> | null = null
export default defineComponent({
    name: "app-control",
    components: {
        "tabs":   Tabs,
        "tab":    Tab
        // "slider": Slider,
        // "toggle": Toggle
    },
    props: {
        selectTab:  { type: String, default: "settings" },
        serviceUrl: { type: String, default: "" },
        wsUrl:      { type: String, default: "" }
    },
    data: () => ({
        formatSliderValue: (v: number) => v.toFixed(2),
        ps: null as PerfectScrollbar | null,
        tab: "",
        state:        StateDefault,
        stateDefault: StateDefault,
        watchState: true,
        status: {
            kind: "",
            msg:  ""
        },
        connection: {
            online: false,
            send:   false,
            recv:   false
        },
        pkg
    }),
    async mounted () {
        /*  force particular tab to be selected  */
        (this.$refs.tabs as any).selectTab(`#${this.selectTab}`)

        /*  establish server connection  */
        const ws = new RecWebSocket(this.wsUrl + "/control", [], {
            reconnectionDelayGrowFactor: 1.3,
            maxReconnectionDelay:        4000,
            minReconnectionDelay:        1000,
            connectionTimeout:           4000,
            minUptime:                   5000
        })
        ws.addEventListener("open", (ev) => {
            this.connection.online = true
        })
        ws.addEventListener("close", (ev) => {
            this.connection.online = false
            this.raiseStatus("error", "WebSocket connection failed/closed", 2000)
        })

        /*  receive server messages  */
        ws.addEventListener("message", (ev: MessageEvent) => {
            this.connection.recv = true
            setTimeout(() => {
                this.connection.recv = false
            }, 250)
            if (typeof ev.data !== "string") {
                this.raiseStatus("warning", "invalid WebSocket message received", 1000)
                return
            }
            const data: any = JSON.parse(ev.data)
            if (!(typeof data === "object" && typeof data.cmd === "string" && data.arg !== undefined)) {
                this.raiseStatus("warning", "invalid WebSocket message received", 1000)
                return
            }
            if (data.cmd === "STATE") {
                const state = data.arg.state as StateTypePartial
                const errors = [] as Array<string>
                if (!Ducky.validate(state, StateSchemaPartial, errors))
                    throw new Error(`invalid schema of loaded state: ${errors.join(", ")}`)
                this.importState(state)
            }
        })

        /*  initially load state  */
        await this.loadState()

        /*  react on all subsequent state changes  */
        let timer: ReturnType<typeof setTimeout> | null = null
        let queue = [] as string[]
        for (const path of StatePaths) {
            console.log(`state.${path}`)
            this.$watch(`state.${path}`, () => {
                if (!this.watchState)
                    return
                queue.push(path)
                if (timer !== null)
                    return
                timer = setTimeout(async () => {
                    timer = null
                    const paths = queue
                    queue = []
                    await this.patchState(paths)
                }, 100)
            })
        }
    },
    methods: {
        /*  raise a temporaily visible status message in the footer  */
        raiseStatus (kind: string, msg: string, duration = 4000) {
            this.status.kind = kind
            this.status.msg  = msg
            if (statusTimer !== null)
                clearTimeout(statusTimer)
            statusTimer = setTimeout(() => {
                this.status.kind = ""
                this.status.msg  = ""
                statusTimer = null
            }, duration)
        },

        /*  open preview URL in own window  */
        previewOpen () {
            window.open(`${this.serviceUrl}#/render`, "_blank")
        },

        /*  copy preview URL to clipboard  */
        previewCopy () {
            navigator.clipboard.writeText(`${this.serviceUrl}#/render`)
        },

        /*  update URL on tab changes  */
        tabChanged (tab: any) {
            this.tab = tab.tab.computedId
            window.location.hash = `#/control/${this.tab}`
        },

        /*  import a field  */
        fieldImport (txt: string, min: number, max: number) {
            txt = txt.replace(/^s+/, "").replace(/\s+$/, "")
            let n = parseFloat(txt)
            if (Number.isNaN(n))
                n = 0
            n = Math.max(Math.min(n, max), min)
            return n
        },

        /*  export a field  */
        fieldExport (n: number, digits = 2, nosign = false) {
            let txt = n.toFixed(digits)
            if (!txt.match(/^-/) && !nosign)
                txt = `+${txt}`
            return txt
        },

        /*  merge partial state into current state  */
        mergeState (state: Readonly<StateTypePartial>, paths?: Readonly<string[]>) {
            return StateUtil.copy(this.state, state, paths)
        },

        /*  import partial state into current state  */
        importState (state: Readonly<StateTypePartial>, paths?: Readonly<string[]>) {
            this.watchState = false
            const changed = this.mergeState(state, paths)
            if (changed)
                setTimeout(() => { this.watchState = true }, 50)
            else
                this.watchState = true
        },

        /*  export partial state from current state  */
        exportState (paths?: Readonly<string[]>): StateTypePartial {
            const dst = {}
            StateUtil.copy(dst, this.state, paths)
            return dst
        },

        /*  load current state  */
        async loadState () {
            this.connection.recv = true
            const state = await axios({
                method: "GET",
                url:    `${this.serviceUrl}state`
            }).then((response) => response.data).catch(() => null).finally(() => {
                this.connection.recv = false
            })
            if (state === null)
                throw new Error("failed to load state")
            const errors = [] as Array<string>
            if (!Ducky.validate(state, StateSchema, errors))
                throw new Error(`invalid schema of loaded state: ${errors.join(", ")}`)
            this.mergeState(state as StateType)
        },

        /*  save current state  */
        async saveState () {
            this.connection.send = true
            await axios({
                method: "POST",
                url:    `${this.serviceUrl}state`,
                data:   this.state
            }).finally(() => {
                this.connection.send = false
            })
        },

        /*  patch current state  */
        async patchState (paths: Readonly<string[]>) {
            const state = {}
            StateUtil.copy(state, this.state, paths)
            this.connection.send = true
            await axios({
                method: "PATCH",
                url:    `${this.serviceUrl}state`,
                data:   state
            }).finally(() => {
                this.connection.send = false
            })
        }
    }
})
</script>

