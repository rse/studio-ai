/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

/*  import external dependencies  */
import { EventEmitter }                                     from "events"
import axios                                                from "axios"
import { LiveAvatarSession, SessionEvent, AgentEventsEnum } from "@heygen/liveavatar-web-sdk"
import ChromaKey                                            from "./app-sv-chromakey"

/*  type of constructor options  */
export type Text2SpeechOptions = {
    apiToken:    string,
    avatar:      string,
    language:    string,
    ckEnable:    boolean,
    ckThreshold: number,
    ckSmoothing: number,
    device:      string,
    video:       HTMLVideoElement | null
}

/*  list of avatars working with HeyGen Instant Avatar Streaming API  */
export type Text2SpeechAvatarType = {
    id:        string,
    name:      string,
    avatarId:  string,
    contextId: string,
    voiceId:   string
}
export const Text2SpeechAvatars = [
    { id: "katya-black",      name: "Katya (Black Suit)",      avatarId: "26393b8e-e944-4367-98ef-e2bc75c4b792", contextId: "094505de-fef7-4b09-9b75-11a86fe8fd6c", voiceId: "" },
    { id: "graham-black",     name: "Graham (Black Suit)",     avatarId: "03f8332d-9046-42a1-bff3-3b2309f77b58", contextId: "094505de-fef7-4b09-9b75-11a86fe8fd6c", voiceId: "" },
    { id: "amina-black",      name: "Amina (Black Suit)",      avatarId: "42700a53-38ab-4485-b46f-26be6e0953dc", contextId: "094505de-fef7-4b09-9b75-11a86fe8fd6c", voiceId: "" },
    { id: "amina-blue",       name: "Amina (Blue Suit)",       avatarId: "bfed3e3e-7d44-4fdb-b2be-ce9a9fd0b9b5", contextId: "094505de-fef7-4b09-9b75-11a86fe8fd6c", voiceId: "" },
    { id: "anthony-white",    name: "Anthony (White Suit)",    avatarId: "509609b9-cda3-4f74-b1b2-97b4d98834fd", contextId: "094505de-fef7-4b09-9b75-11a86fe8fd6c", voiceId: "" },
    { id: "anthony-black",    name: "Anthony (Black Suit)",    avatarId: "38ad67ed-98f0-407c-a2d2-4f0998b306fc", contextId: "094505de-fef7-4b09-9b75-11a86fe8fd6c", voiceId: "" },
    { id: "rika-blue",        name: "Rika (Blue Suit)",        avatarId: "0aae6046-0ab9-44fe-a08d-c5ac3f406d34", contextId: "094505de-fef7-4b09-9b75-11a86fe8fd6c", voiceId: "" },
    { id: "pedro-black",      name: "Pedro (Black Suit)",      avatarId: "200eba85-74c0-4210-8670-81ceab4efd0d", contextId: "094505de-fef7-4b09-9b75-11a86fe8fd6c", voiceId: "" },
    { id: "alessandra-black", name: "Alessandra (Black Suit)", avatarId: "9c59a215-4c9f-478f-9d95-edca74c7b0d0", contextId: "094505de-fef7-4b09-9b75-11a86fe8fd6c", voiceId: "" },
    { id: "anastasia-black",  name: "Anastasia (Black Suit)",  avatarId: "ebdfdc7e-7e2c-4d2c-8407-a78883e5000a", contextId: "094505de-fef7-4b09-9b75-11a86fe8fd6c", voiceId: "" },
    { id: "thaddeus-black",   name: "Thaddeus (Black Suit)",   avatarId: "246e8d9d-5826-4f49-b8a0-07cb73ff7556", contextId: "094505de-fef7-4b09-9b75-11a86fe8fd6c", voiceId: "" },
    { id: "marianne-black",   name: "Marianne (Black Suit)",   avatarId: "f86e8b45-3389-424a-b3d7-7f6e8729e36d", contextId: "094505de-fef7-4b09-9b75-11a86fe8fd6c", voiceId: "" },
    { id: "marianne-red",     name: "Marianne (Red Suit)",     avatarId: "8532b602-89e8-44fa-a9e2-5a4259a058cc", contextId: "094505de-fef7-4b09-9b75-11a86fe8fd6c", voiceId: "" }
] as Array<Text2SpeechAvatarType>

/*  Text-to-Speech API class  */
export default class Text2Speech extends EventEmitter {
    /*  default option values  */
    private options = {
        apiToken:    "",
        avatar:      "",
        language:    "",
        ckEnable:    true,
        ckThreshold: 0.30,
        ckSmoothing: 0.10,
        device:      "",
        video:       null
    } as Text2SpeechOptions

    /*  internal state  */
    private avatar: LiveAvatarSession | null = null
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
        this.log("ERROR", error.toString())
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

        /*  determine session parameters  */
        const avatar = Text2SpeechAvatars.find((entry) => entry.id === this.options.avatar)
        if (avatar === undefined)
            throw new Error("invalid avatar")
        const options = {
            mode:           "FULL",
            avatar_id:      avatar.avatarId,
            avatar_persona: {
                context_id: avatar.contextId,
                language:   this.options.language
            }
        } as any
        if (avatar.voiceId !== "")
            options.avatar_persona!.voice_id = avatar.voiceId

        /*  fetch streaming session token  */
        this.log("INFO", "HeyGen: fetch streaming session token")
        const response = await axios({
            method:  "POST",
            url:     "https://api.liveavatar.com/v1/sessions/token",
            headers: { "x-api-key": this.options.apiToken },
            data:    options,
            validateStatus: (status) => status < 500
        })
        if (response.status !== 200)
            this.error(`failed to fetch session token: "${JSON.stringify(response.data)}"`)
        const id    = response.data?.data?.session_id    ?? ""
        const token = response.data?.data?.session_token ?? ""

        /*  create new streaming avatar  */
        this.log("INFO", "HeyGen: establish new streaming avatar")
        this.avatar = new LiveAvatarSession(token)

        /*  react on connection events  */
        this.avatar.on(SessionEvent.SESSION_STREAM_READY, async () => {
            this.log("INFO", "HeyGen: streaming avatar: ready")

            /*  attach avatar to our video element  */
            this.avatar?.attach(this.options.video!)

            /*  optionally apply chroma-key to media stream  */
            if (this.options.ckEnable) {
                /*  wait a small amount of time to ensure that the srcObject on
                    the video element was finally modified by underlying LiveKit  */
                await new Promise((resolve) => setTimeout(resolve, 50))

                /*  determine underlying media stream  */
                if (!(this.options.video!.srcObject instanceof MediaStream))
                    this.error("video element does not contain a MediaStream")
                let stream = this.options.video!.srcObject

                /*  wrap chroma-key transformation over stream  */
                this.log("INFO", "apply chroma-key video transformer")
                this.chromaKey = new ChromaKey({
                    threshold: this.options.ckThreshold,
                    smoothing: this.options.ckSmoothing
                })
                stream = this.chromaKey.process(stream)

                /*  replace the media stream inside the video element  */
                this.options.video!.srcObject = stream
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

            /*  lazy unmute video element  */
            this.options.video!.addEventListener("play", () => {
                if (this.options.video!.muted) {
                    this.log("INFO", "HeyGen: streaming avatar: lazy unmuting video element")
                    this.options.video!.muted = false
                }
            }, { once: true })

            /*  try to play the content  */
            this.options.video!.play().catch(() => {
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
        this.avatar.on(SessionEvent.SESSION_DISCONNECTED, async (ev) => {
            /*  disable keep-alive handling  */
            if (this.keepaliveTimer !== null) {
                clearInterval(this.keepaliveTimer)
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
                this.closing = false
            }
        })

        /*  react on talking events  */
        this.avatar.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, (ev) => {
            this.log("INFO", "HeyGen: streaming avatar: start talking")
            this.talking = true
            this.emit("speak:start")
        })
        this.avatar.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, (ev) => {
            /*  for keep-alive messages the API sends a stop event without previous start event  */
            if (!this.talking)
                return
            this.log("INFO", "HeyGen: streaming avatar: stop talking")
            this.talking = false
            this.emit("speak:stop")
        })

        this.traffic({ send: true })
        await this.avatar.start().catch((error) => {
            let msg = error instanceof Error ? error.message : error.toString()
            if (msg.match(/status\s+400/))
                msg = "quota reached"
            this.error(`HeyGen: failed to start avatar: ${msg}`)
        })
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
        this.avatar.repeat(text)
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
            this.avatar.interrupt()
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
            await this.avatar.keepAlive()
        }
    }

    /*  close Text-to-Speech engine  */
    async close () {
        this.closing = true
        if (this.keepaliveTimer !== null) {
            clearInterval(this.keepaliveTimer)
            this.keepaliveTimer = null
        }
        if (this.avatar !== null) {
            this.log("INFO", "HeyGen: streaming avatar: stopping avatar")
            this.traffic({ send: true })
            await this.avatar.stop()
            this.avatar = null
        }
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
                /*  intentionally ignore video cleanup errors during shutdown  */
            }
        }
    }
}
