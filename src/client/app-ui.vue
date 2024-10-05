<!--
**
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
**
-->

<template>
    <div class="app">
        <!--  Control UI  -->
        <control
            ref="control"
            v-if="mode === 'control'"
            v-bind:select-tab-0="tab0"
            v-bind:select-tab-1="tab1"
            v-bind:ws-url="wsURL"
            v-bind:service-url="serviceURL"
        ></control>

        <!--  Render UI  -->
        <render
            ref="render"
            v-if="mode === 'render'"
            v-bind:options="options"
            v-bind:ws-url="wsURL"
            v-bind:service-url="serviceURL"
        ></render>
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import URI                 from "urijs"
import Control             from "./app-ui-control.vue"
import Render              from "./app-ui-render.vue"
</script>

<script lang="ts">
export default defineComponent({
    name: "app",
    components: {
        "control": Control,
        "render":  Render
    },
    data: () => ({
        mode:       "control",
        tab0:       "control",
        tab1:       "",
        options:    new Map<string, string | boolean>(),
        serviceURL: "",
        wsURL:      ""
    }),
    created () {
        /*  determine mode  */
        let url = new URI(window.location.href)
        const hash = url.hash()
        let m
        if ((m = hash.match(/^#\/render(?:\?(.+))?$/)) !== null) {
            this.mode = "render"
            if (m[1]) {
                const opts = m[1].split("&")
                for (const opt of opts) {
                    let m2
                    if ((m2 = opt.match(/^(.+)=(.+)$/)) !== null)
                        this.options.set(m2[1], m2[2])
                    else
                        this.options.set(opt, true)
                }
            }
        }
        else if ((m = hash.match(/^#\/control(?:\/(.+?)(?:\/(.+?))?)?$/)) !== null) {
            this.mode = "control"
            this.tab0 = m[1] ?? "control"
            this.tab1 = m[2] ?? ""
        }
        else {
            url.hash("#/control/control")
            window.location.replace(url.toString())
        }

        /*  determine URL for WebSocket connections  */
        url = new URI(window.location.href)
        url.protocol(`ws${url.protocol() === "https" ? "s" : ""}`)
        url.pathname("/ws")
        url.search("")
        url.hash("")
        this.wsURL = url.toString()

        /*  determine URL for REST connections  */
        url = new URI(window.location.href)
        url.pathname("")
        url.search("")
        url.hash("")
        this.serviceURL = url.toString()
    }
})
</script>

