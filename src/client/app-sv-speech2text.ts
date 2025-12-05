/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

/*  import external dependencies  */
import { EventEmitter }       from "events"
import * as Deepgram          from "@deepgram/sdk"
import { AudioNodeAmplitude } from "audio-node-suite"
import {
    MediaRecorder as MR,
    IMediaRecorder,
    register as MRr
}                             from "extendable-media-recorder"
import { connect as MRc }     from "extendable-media-recorder-wav-encoder"

/*  type of constructor options  */
export type Speech2TextOptions = {
    device:   string,
    apiToken: string,
    model:    string,
    version:  string,
    language: string,
    keywords: string
}

/*  type of text chunk  */
export type Speech2TextChunk = {
    text:     string,
    final:    boolean
}

/*  Speech-to-Text API class  */
export default class Speech2Text extends EventEmitter {
    /*  default option values  */
    private options = {
        device:   "Default",
        apiToken: "",
        model:    "nova-2-general",
        version:  "latest",
        language: "en",
        keywords: ""
    } as Speech2TextOptions

    /*  internal state  */
    private static initialized = false
    private stream: MediaStream | null = null
    private mediarecorder: IMediaRecorder | null = null
    private audioCtx: AudioContext | null = null
    private audioMeter: AudioNodeAmplitude | null = null
    private deepgram: Deepgram.LiveClient | null = null
    private deepgramTimer: ReturnType<typeof setInterval> | null = null

    /*  exposed state  */
    public active = false

    /*  API class constructor  */
    constructor (options: Speech2TextOptions) {
        super()
        this.options.device   = options.device
        this.options.apiToken = options.apiToken
        this.options.model    = options.model
        this.options.version  = options.version
        this.options.language = options.language
        this.options.keywords = options.keywords
    }

    /*  minimum logging handling  */
    log (level: string, msg: string) {
        this.emit("log", level, msg)
    }

    /*  minimum traffic monitoring  */
    traffic (flags: { send?: boolean, recv?: boolean }) {
        this.emit("traffic", flags)
    }

    /*  minimum fatal error handling  */
    error (reason: string | Error): never {
        const error = typeof reason === "string" ? new Error(reason) : reason
        this.emit("log", "ERROR", error.toString())
        throw error
    }

    /*  open Speech-to-Text engine  */
    async open () {
        if (!Speech2Text.initialized) {
            /*  ensure video devices can be enumerated by requesting a
                dummy media stream so permissions are granted once  */
            this.log("INFO", "requesting video device access")
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            }).catch(() => null)
            if (stream !== null)
                stream.getTracks().forEach((track) => track.stop())

            /*  initialize custom media recorder  */
            this.log("INFO", "initializing media recorder")
            await MRr(await MRc())

            /*  remember that we were now once initialized  */
            Speech2Text.initialized = true
        }

        /*  determine microphone device  */
        this.log("INFO", "WebAudio: determine microphone device")
        const devices = await navigator.mediaDevices.enumerateDevices().catch(() => [])
        const device = devices.find((device) =>
            device.kind === "audioinput"
            && device.label.substring(0, this.options.device.length) === this.options.device
        )
        if (device === undefined)
            this.error(`failed to determine audio stream (device: "${this.options.device}"): no such device`)

        /*  gather microphone device  */
        this.log("INFO", "WebAudio: gather microphone device")
        let channelCount = 1
        let sampleRate   = 48000
        let sampleSize   = 16
        this.stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: { exact: device.deviceId },
                channelCount,
                sampleRate,
                sampleSize,
                noiseSuppression: true,
                echoCancellation: true,
                autoGainControl:  false
            },
            video: false
        }).catch((err: Error) => {
            this.error(`failed to get media stream: ${err}`)
        })

        /*  determine details of microphone device  */
        this.log("INFO", "WebAudio: inspect microphone device")
        this.stream.getTracks().forEach((track) => {
            const settings = track.getSettings()
            if (settings.channelCount) channelCount = settings.channelCount
            if (settings.sampleRate)   sampleRate   = settings.sampleRate
            if (settings.sampleSize)   sampleSize   = settings.sampleSize
        })
        if (sampleSize !== 16)
            throw new Error(`invalid audio sample size ${sampleSize}`)
        this.log("INFO", "WebAudio: microphone device info: " +
            `channels: ${channelCount}, sampleRate: ${sampleRate}, sampleSize: ${sampleSize}`)

        /*  create audio graph for amplification observation  */
        this.log("INFO", "WebAudio: create audio graph for volume meter")
        this.audioCtx = new AudioContext({
            latencyHint: "interactive",
            sampleRate
        })
        const audioSrc = this.audioCtx.createMediaStreamSource(this.stream)
        const audioDst = this.audioCtx.createMediaStreamDestination()
        this.audioMeter = new AudioNodeAmplitude(this.audioCtx, {
            intervalTime:       1000 / 30,
            intervalCount:      300 * (1000 / 30),
            decibelBars:        [ -60, -45, -21, -6 ],
            colorBars:          [ "#904800", "#a05810", "#b06820", "#c07830" ],
            colorBarsDeactive:  [ "#606060", "#808080", "#a0a0a0", "#c0c0c0" ],
            colorRMS:           "#ff0000",
            colorBackground:    "#222222",
            horizontal:         true
        })
        audioSrc.connect(this.audioMeter)
        this.audioMeter.connect(audioDst)

        /*  establish audio capturing  */
        this.log("INFO", "WebAudio: microphone device capturing")
        this.mediarecorder = new MR(this.stream, {
            audioBitsPerSecond: 128000,
            mimeType: "audio/wav" /* custom PCM variant for Deepgram  */
        })
        this.mediarecorder.addEventListener("dataavailable", async (ev) => {
            if (ev.data.size > 0 && this.deepgram !== null && this.active)
                this.deepgram.send(ev.data)
        })
        this.mediarecorder.start(100 /* ms */)

        /*  connect to Deepgram API  */
        this.log("INFO", "Deepgram: connection to Websocket API initiating")
        const deepgramClient = Deepgram.createClient(this.options.apiToken)
        let language = "en"
        if (this.options.model.match(/^nova-2/) && this.options.language !== "en")
            language = this.options.language
        else if (this.options.model.match(/^nova-3/) && this.options.language !== "en")
            language = "multi"
        const options: Deepgram.LiveSchema = {
            mip_opt_out:      true,
            model:            this.options.model,
            version:          this.options.version,
            language,
            channels:         channelCount,
            multichannel:     false,
            sample_rate:      sampleRate,
            encoding:         "linear16",
            endpointing:      false,
            interim_results:  true,
            numerals:         true,
            punctuate:        true,
            paragraphs:       true,
            smart_format:     true,
            diarize:          false,
            dictation:        false,
            filler_words:     false,
            measurements:     false,
            profanity_filter: false,
            utterances:       false
        }
        if (this.options.keywords !== "") {
            if (this.options.model.match(/^nova-2/))
                options.keywords = this.options.keywords
                    .split(/(?:\s+|\s*,\s*)/)
                    .map((kw) => `${kw}:1`)
            else if (this.options.model.match(/^nova-3/) && this.options.language === "en")
                options.keyterm = this.options.keywords
                    .split(/(?:\s+|\s*,\s*)/)
                    .join(" ")
        }
        this.deepgram = deepgramClient.listen.live(options)

        /*  wait for connection  */
        await new Promise((resolve, reject) => {
            let timer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
                this.deepgram!.off(Deepgram.LiveTranscriptionEvents.Open,  onOpen)
                this.deepgram!.off(Deepgram.LiveTranscriptionEvents.Error, onError)
                if (timer !== null) {
                    timer = null
                    reject(new Error("Deepgram: timeout waiting for connection open"))
                }
            }, 3000)
            const clearTimer = () => {
                if (timer !== null) {
                    clearTimeout(timer)
                    timer = null
                }
            }
            const onOpen = () => {
                this.deepgram!.off(Deepgram.LiveTranscriptionEvents.Error, onError)
                clearTimer()
                resolve(null)
            }
            const onError = (ev: Deepgram.LiveTranscriptionEvent) => {
                this.deepgram!.off(Deepgram.LiveTranscriptionEvents.Open, onOpen)
                clearTimer()
                reject(new Error(`Deepgram: error: event: ${JSON.stringify(ev)}`))
            }
            this.deepgram!.once(Deepgram.LiveTranscriptionEvents.Open, onOpen)
            this.deepgram!.once(Deepgram.LiveTranscriptionEvents.Error, onError)
        }).catch((err: Error) => {
            this.error(`Deepgram: connection to Websocket API failed (initially): ${err}`)
        })
        this.log("INFO", "Deepgram: connection to Websocket API opened (initially)")
        this.emit("open")

        /*  hooks onto Deepgram API events  */
        this.deepgram.on(Deepgram.LiveTranscriptionEvents.Open, () => {
            this.log("INFO", "Deepgram: connection to Websocket API opened")
            this.emit("open")
        })
        this.deepgram.on(Deepgram.LiveTranscriptionEvents.Close, () => {
            this.log("INFO", "Deepgram: connection to Websocket API closed")
            this.emit("close")
        })
        this.deepgram.on(Deepgram.LiveTranscriptionEvents.Error, (ev: Deepgram.LiveTranscriptionEvent) => {
            this.log("ERROR", `Deepgram: ERROR: ${JSON.stringify(ev)}`)
            this.emit("error")
        })
        this.deepgram.on(Deepgram.LiveTranscriptionEvents.Metadata, (data: any) => {
            this.log("INFO", `Deepgram: meta data received (duration: ${data.duration ?? 0.0})`)
        })
        this.deepgram.on(Deepgram.LiveTranscriptionEvents.SpeechStarted, () => {
            this.log("INFO", "Deepgram: speech started")
        })
        this.deepgram.on(Deepgram.LiveTranscriptionEvents.UtteranceEnd, () => {
            this.log("INFO", "Deepgram: utterance end")
        })
        this.deepgram.on(Deepgram.LiveTranscriptionEvents.Unhandled, (data: any) => {
            this.log("ERROR", `Deepgram: ERROR: unhandled event: ${JSON.stringify(data)}`)
        })
        this.deepgram.on(Deepgram.LiveTranscriptionEvents.Transcript, async (data: Deepgram.LiveTranscriptionEvent) => {
            this.traffic({ recv: true })
            const text = data.channel?.alternatives[0].transcript ?? ""
            if (text === "")
                return
            this.log("INFO", `Deepgram: transcript received: "${text}" (duration: ${data.duration}, final: ${data.is_final})`)
            this.emit("text", { text, final: data.is_final } as Speech2TextChunk)
        })

        /*  Deepgram API has a timeout of 10 seconds, so keep it open  */
        this.deepgramTimer = setInterval(() => {
            if (this.deepgram !== null) {
                this.log("INFO", "Deepgram: sending keep-alive message to Websocket API")
                this.deepgram.keepAlive()
            }
        }, 3000)

        this.log("INFO", "Deepgram: ready for operation")
    }

    /*  apply audio meter to canvas DOM element  */
    audioMeterApply (canvas: HTMLCanvasElement) {
        if (this.audioMeter === null)
            return
        this.audioMeter.draw(canvas)
        this.audioMeter.deactive(!this.active)
    }

    /*  unapply audio meter from canvas DOM element  */
    audioMeterUnapply (canvas: HTMLCanvasElement) {
        if (this.audioMeter === null)
            return
        this.audioMeter.undraw(canvas)
    }

    /*  activate/deactivate Speech-to-Text engine  */
    setActive (active: boolean) {
        this.active = active
        if (!this.active && this.deepgram !== null) {
            this.log("INFO", "Deepgram: finalizing current transcription")
            this.deepgram.finalize()
            this.deepgram.keepAlive()
        }
        if (this.audioMeter !== null)
            this.audioMeter.deactive(!active)
    }

    /*  close Speech-to-Text engine  */
    async close () {
        /*  shutdown Deepgram API  */
        if (this.deepgram !== null) {
            this.log("INFO", "shutdown: Deepgram Websocket API connection")
            if (this.deepgramTimer !== null) {
                clearInterval(this.deepgramTimer)
                this.deepgramTimer = null
            }
            this.deepgram.requestClose()
            this.deepgram = null
        }

        /*  shutdown media recorder  */
        if (this.mediarecorder !== null) {
            this.log("INFO", "shutdown: WebAudio media recorder")
            this.mediarecorder.stop()
            this.mediarecorder = null
        }

        /*  shutdown audio graph  */
        if (this.audioCtx !== null) {
            this.log("INFO", "shutdown: WebAudio audio context")
            this.audioCtx.close()
            this.audioCtx = null
        }

        /*  shutdown media stream  */
        if (this.stream !== null) {
            this.log("INFO", "shutdown: WebAudio media stream")
            this.stream.getTracks().forEach((track) => { track.stop() })
            this.stream = null
        }
    }
}
