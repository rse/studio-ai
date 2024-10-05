/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

/*  import external dependencies  */
import { EventEmitter }       from "events"
import axios                  from "axios"
import StreamingAvatar, {
    AvatarQuality,
    StreamingEvents,
    VoiceEmotion,
    TaskType
} from "@heygen/streaming-avatar"
import ChromaKey from "./app-sv-chromakey"

/*  type of constructor options  */
export type Text2SpeechOptions = {
    apiToken:    string,
    avatarId:    string,
    quality:     string,
    voiceId:     string,
    rate:        number,
    emotion:     string,
    language:    string,
    ckEnable:    boolean,
    ckThreshold: number,
    ckSmoothing: number,
    device:      string,
    video:       HTMLVideoElement | null
}

/*  Text-to-Speech API class  */
export default class Speech2Text extends EventEmitter {
    /*  default option values  */
    private options = {
        apiToken:    "",
        avatarId:    "",
        quality:     "",
        voiceId:     "",
        rate:        1.0,
        emotion:     "",
        language:    "",
        ckEnable:    true,
        ckThreshold: 0.30,
        ckSmoothing: 0.10,
        device:      "",
        video:       null
    } as Text2SpeechOptions

    /*  internal state  */
    private avatar:  StreamingAvatar | null = null
    private sessionId: string = ""
    private connected = false
    private closing   = false
    private talking   = false
    private chromaKey: ChromaKey | null = null

    /*  API class constructor  */
    constructor (options: Text2SpeechOptions) {
        super()
        this.options.apiToken     = options.apiToken
        this.options.avatarId     = options.avatarId
        this.options.quality      = options.quality
        this.options.voiceId      = options.voiceId
        this.options.rate         = options.rate
        this.options.emotion      = options.emotion
        this.options.language     = options.language
        this.options.ckEnable     = options.ckEnable
        this.options.ckThreshold  = options.ckThreshold
        this.options.ckSmoothing  = options.ckSmoothing
        this.options.device       = options.device
        this.options.video        = options.video
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

    /*  open Text-to-Speech engine  */
    async open () {
        this.log("INFO", "HeyGen: ready for operation")

        /*  fetch streaming session token  */
        this.log("INFO", "HeyGen: fetch streaming session token")
        const response = await axios({
            method:  "POST",
            url:     "https://api.heygen.com/v1/streaming.create_token",
            headers: { "x-api-key": this.options.apiToken },
            data:    {}
        })
        if (response.status !== 200)
            this.error(`failed to fetch session token: "${response.data?.error ?? ""}"`)
        const token = response.data?.data?.token ?? ""

        /*  create new streaming avatar  */
        this.log("INFO", "HeyGen: establish new streaming avatar")
        this.avatar = new StreamingAvatar({ token })

        /*  react on connection events  */
        this.avatar.on(StreamingEvents.STREAM_READY, (ev: CustomEvent) => {
            this.log("INFO", "HeyGen: streaming avatar: ready")
            let stream = ev.detail as MediaStream
            if (this.options.ckEnable) {
                this.log("INFO", "apply chroma-key video transformer")
                this.chromaKey = new ChromaKey({
                    threshold: this.options.ckThreshold,
                    smoothing: this.options.ckSmoothing
                })
                stream = this.chromaKey.process(stream)
            }
            this.options.video!.srcObject = stream
            this.options.video!.addEventListener("play", () => {
                if (this.options.video!.muted) {
                    this.log("INFO", "HeyGen: streaming avatar: lazy unmuting video element")
                    this.options.video!.muted = false
                }
            }, { once: true })
            this.options.video!.play().catch(() => {
                this.log("INFO", "HeyGen: streaming avatar: playing of video element has to be deferred")
                document.addEventListener("click", () => {
                    this.log("INFO", "HeyGen: streaming avatar: deferred unmuting video element")
                    this.options.video!.muted = false
                    this.options.video!.play().catch(() => {})
                }, { once: true })
            })
            this.connected = true
            this.emit("open")
        })
        this.avatar.on(StreamingEvents.STREAM_DISCONNECTED, async (ev: CustomEvent) => {
            if (!this.closing) {
                this.log("INFO", "HeyGen: streaming avatar: disconnected (unexpected without close) -- reconnecting")
                this.connected = false
                this.emit("reconnect")
                await this.close()
                this.open()
            }
            else {
                this.log("INFO", "HeyGen: streaming avatar: disconnected (expected during close)")
                this.connected = false
                this.emit("close")
                this.close()
            }
        })

        /*  react on talking events  */
        this.avatar.on(StreamingEvents.AVATAR_START_TALKING, (ev: CustomEvent) => {
            this.log("INFO", "HeyGen: streaming avatar: start talking")
            this.talking = true
            this.emit("speak:start")
        })
        this.avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (ev: CustomEvent) => {
            const duration = ev.detail.duration_ms as number ?? 0
            this.log("INFO", `HeyGen: streaming avatar: stop talking (duration: ${duration})`)
            this.talking = false
            this.emit("speak:stop", { duration })
        })

        /*  start new streaming  */
        let quality = AvatarQuality.Low
        if      (this.options.quality === "low")    quality = AvatarQuality.Low
        else if (this.options.quality === "medium") quality = AvatarQuality.Medium
        else if (this.options.quality === "high")   quality = AvatarQuality.High
        let emotion = VoiceEmotion.BROADCASTER
        if      (this.options.emotion === "broadcaster") emotion = VoiceEmotion.BROADCASTER
        else if (this.options.emotion === "excited")     emotion = VoiceEmotion.EXCITED
        else if (this.options.emotion === "friendly")    emotion = VoiceEmotion.FRIENDLY
        else if (this.options.emotion === "serious")     emotion = VoiceEmotion.SERIOUS
        else if (this.options.emotion === "soothing")    emotion = VoiceEmotion.SOOTHING
        const info = await this.avatar.createStartAvatar({
            avatarName:  this.options.avatarId,
            quality,
            voice: {
                voiceId: this.options.voiceId,
                rate:    this.options.rate,
                emotion
            },
            language:    this.options.language
        })
        this.sessionId = info.session_id ?? ""
    }

    /*  speak text  */
    async speak (text: string) {
        /*  sanity check situation  */
        if (this.avatar === null)
            throw new Error("connection still not established")
        if (!this.connected)
            throw new Error("connected still not ready")

        /*  optionally interrupt still active speaking  */
        if (this.talking) {
            this.log("INFO", "HeyGen: streaming avatar: interrupting still active speaking")
            await this.avatar.interrupt()
            await new Promise<void>((resolve) => {
                const poll = () => {
                    if (this.talking)
                        setTimeout(poll, 10)
                    else
                        resolve()
                }
                setTimeout(poll, 10)
            })
        }

        /*  start new speaking  */
        this.log("INFO", `HeyGen: streaming avatar: speak "${text}"`)
        await this.avatar.speak({
            text,
            task_type: TaskType.REPEAT
        })
    }

    /*  close Text-to-Speech engine  */
    async close () {
        this.closing = true
        if (this.chromaKey !== null) {
            this.log("INFO", "destroying chroma-key video transformer")
            this.chromaKey.destroy()
            this.chromaKey = null
        }
        if (this.options.video !== null) {
            this.log("INFO", "clearing video element")
            try {
                const video = this.options.video
                video.pause()
                video.src = ""
                video.load()
            }
            catch (err) {
            }
        }
        if (this.avatar !== null) {
            this.log("INFO", "HeyGen: streaming avatar: stopping avatar")
            await this.avatar.stopAvatar()
            this.avatar = null
        }
        this.closing = false
    }

    /*  one-time destruction  */
    async destroy () {
        /*  no-op  */
    }
}
