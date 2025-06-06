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
    TaskType,
    StartAvatarRequest
} from "@heygen/streaming-avatar"
import ChromaKey from "./app-sv-chromakey"

/*  type of constructor options  */
export type Text2SpeechOptions = {
    apiToken:    string,
    avatar:      string,
    quality:     string,
    rate:        number,
    emotion:     string,
    language:    string,
    ckEnable:    boolean,
    ckThreshold: number,
    ckSmoothing: number,
    device:      string,
    video:       HTMLVideoElement | null
}

/*  list of avatars working with HeyGen Instant Avatar Streaming API  */
export type Text2SpeechAvatarType = {
    id:       string,
    name:     string,
    avatarId: string,
    voiceId:  string
}
export const Text2SpeechAvatars = [
    { id: "kayla",       name: "Kayla",       avatarId: "Kayla-incasualsuit-20220818",         voiceId: "21d9632a2fc842308ad9b5c5b5014e3a" },
    { id: "katya",       name: "Katya",       avatarId: "Katya_Black_Suit_public",             voiceId: "" },
    { id: "alessandra",  name: "Alessandra",  avatarId: "Alessandra_ProfessionalLook2_public", voiceId: "" },
    { id: "anastasia",   name: "Anastasia",   avatarId: "Anastasia_ProfessionalLook2_public",  voiceId: "" },
    { id: "amina",       name: "Amina",       avatarId: "Amina_ProfessionalLook2_public",      voiceId: "" },
    { id: "rika",        name: "Rika",        avatarId: "Rika_ProfessionalLook2_public",       voiceId: "" },
    { id: "marianne",    name: "Marianne",    avatarId: "Marianne_ProfessionalLook2_public",   voiceId: "" },
    { id: "graham",      name: "Graham",      avatarId: "Graham_ProfessionalLook2_public",     voiceId: "" },
    { id: "edward",      name: "Edward",      avatarId: "Eric_public_pro2_20230608",           voiceId: "" },
    { id: "tyler",       name: "Tyler",       avatarId: "Tyler-incasualsuit-20220721",         voiceId: "" },
    { id: "anna",        name: "Anna",        avatarId: "Anna_public_3_20240108",              voiceId: "" },
    { id: "susan",       name: "Susan",       avatarId: "Susan_public_2_20240328",             voiceId: "" }
] as Array<Text2SpeechAvatarType>

/*  Text-to-Speech API class  */
export default class Text2Speech extends EventEmitter {
    /*  default option values  */
    private options = {
        apiToken:    "",
        avatar:      "",
        quality:     "",
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
    private sessionId = ""
    private connected = false
    private closing   = false
    private talking   = false
    private chromaKey: ChromaKey | null = null
    private keepaliveTimer: ReturnType<typeof setInterval> | null = null

    /*  API class constructor  */
    constructor (options: Text2SpeechOptions) {
        super()
        this.options.apiToken     = options.apiToken
        this.options.avatar       = options.avatar
        this.options.quality      = options.quality
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

    /*  open Text-to-Speech engine  */
    async open () {
        /*  optionally prepare for particular audio output device  */
        if (this.options.device !== "Default") {
            /*  ensure video devices can be enumerated by requesting a
                dummy media stream so permissions are granted once  */
            this.log("INFO", "requesting video device access")
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            }).catch(() => null)
            if (stream !== null)
                stream.getTracks().forEach((track) => track.stop())
        }

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
        this.avatar.on(StreamingEvents.STREAM_READY, async (ev: CustomEvent) => {
            this.log("INFO", "HeyGen: streaming avatar: ready")

            /*  determine media stream  */
            let stream = ev.detail as MediaStream

            /*  optionally apply chroma-key to media stream  */
            if (this.options.ckEnable) {
                this.log("INFO", "apply chroma-key video transformer")
                this.chromaKey = new ChromaKey({
                    threshold: this.options.ckThreshold,
                    smoothing: this.options.ckSmoothing
                })
                stream = this.chromaKey.process(stream)
            }

            /*  optionally use a particular output device  */
            if (this.options.device !== "Default") {
                /*  determine speaker device  */
                this.log("INFO", "WebAudio: determine speaker device")
                const devices = await navigator.mediaDevices.enumerateDevices().catch(() => [])
                const device = devices.find((device) =>
                    device.kind === "audiooutput"
                    && device.label.substring(0, this.options.device.length) === this.options.device
                )
                if (device === undefined)
                    this.error(`WebAudio: failed to determine speaker device "${this.options.device}": no such device`)

                /*  apply speaker device onto video element  */
                this.options.video!.setSinkId(device.deviceId)
            }

            /*  apply media stream onto video element  */
            this.options.video!.srcObject = stream

            /*  lazy unmute video element  */
            this.options.video!.addEventListener("play", () => {
                if (this.options.video!.muted) {
                    this.log("INFO", "HeyGen: streaming avatar: lazy unmuting video element")
                    this.options.video!.muted = false
                }
            }, { once: true })

            /*  try to play the content  */
            await this.options.video!.play().catch(() => {
                this.log("INFO", "HeyGen: streaming avatar: playing of video element has to be deferred")
                document.addEventListener("click", () => {
                    this.log("INFO", "HeyGen: streaming avatar: deferred unmuting video element")
                    this.options.video!.muted = false
                    this.options.video!.play().catch(() => {})
                }, { once: true })
            })

            /*  enable keep-alive handling  */
            this.keepaliveTimer = setInterval(() => {
                this.keepalive()
            }, 1 * 60 * 1000)

            this.connected = true
            this.emit("open")
        })
        this.avatar.on(StreamingEvents.STREAM_DISCONNECTED, async (ev: CustomEvent) => {
            /*  disable keep-alive handling  */
            if (this.keepaliveTimer !== null) {
                clearTimeout(this.keepaliveTimer)
                this.keepaliveTimer = null
            }
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
            /*  for keep-alive messages the API sends a stop event without previous start event  */
            if (!this.talking)
                return
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
        const avatar = Text2SpeechAvatars.find((entry) => entry.id === this.options.avatar)
        if (avatar === undefined)
            throw new Error("invalid avatar")
        const options = {
            avatarName:  avatar.avatarId,
            quality,
            voice: {
                rate:    this.options.rate,
                emotion
            },
            language:    this.options.language
        } as StartAvatarRequest
        if (avatar.voiceId !== "")
            options.voice!.voiceId = avatar.voiceId
        this.traffic({ send: true })
        const info = await this.avatar.createStartAvatar(options)
        this.sessionId = info.session_id ?? ""
        this.log("INFO", "HeyGen: ready for operation")
    }

    /*  speak text  */
    async speak (text: string) {
        /*  sanity check situation  */
        if (this.avatar === null)
            throw new Error("connection still not established")
        if (!this.connected)
            throw new Error("connected still not ready")

        /*  optionally interrupt still active speaking  */
        if (this.talking)
            this.interrupt()

        /*  start new speaking  */
        this.log("INFO", `HeyGen: streaming avatar: speak "${text}"`)
        this.traffic({ send: true })
        await this.avatar.speak({
            text,
            task_type: TaskType.REPEAT
        })
    }

    /*  interrupt task  */
    async interrupt () {
        /*  sanity check situation  */
        if (this.avatar === null)
            throw new Error("connection still not established")
        if (!this.connected)
            throw new Error("connected still not ready")

        /*  interrupt speaking task  */
        if (this.talking) {
            this.log("INFO", "HeyGen: streaming avatar: interrupting active speaking task")
            this.traffic({ send: true })
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
    }

    /*  keep-alive task  */
    async keepalive () {
        /*  sanity check situation  */
        if (this.avatar === null)
            throw new Error("connection still not established")
        if (!this.connected)
            throw new Error("connected still not ready")

        /*  send a dummy task to keep the connection alive  */
        if (!this.talking) {
            this.traffic({ send: true })
            await this.avatar.speak({
                text: ".",
                task_type: TaskType.REPEAT
            })
        }
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
            this.traffic({ send: true })
            await this.avatar.stopAvatar()
            this.avatar = null
        }
        this.closing = false
    }
}
