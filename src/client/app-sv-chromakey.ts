/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

/*  declare still somewhat non-standard MediaStream functionality
    (but already can be used in Chome, which is sufficient for us)  */
declare global {
    class MediaStreamTrackProcessor extends MediaStreamTrack {
        constructor (options: {
            track: MediaStreamTrack,
            maxBufferSize?: number
        })
        readable: ReadableStream
    }
    class MediaStreamTrackGenerator extends MediaStreamTrack {
        constructor (options: { kind: string })
        writable: WritableStream
    }
}

/*  internal helper class for colors  */
export class Color {
    private v: number[]
    constructor (v: number[]) {
        this.v = v
    }
    get r () { return this.v[0] }
    get g () { return this.v[1] }
    get b () { return this.v[2] }
    set r (n: number) { this.v[0] = n }
    set g (n: number) { this.v[1] = n }
    set b (n: number) { this.v[2] = n }
    toYCC () {
        const Y  = 0.2989 * this.r + 0.5866 * this.g + 0.1145 * this.b
        const Cr = 0.7132 * (this.r - Y)
        const Cb = 0.5647 * (this.b - Y)
        return [ Y, Cr, Cb ]
    }
}

/*  type of API constructor options  */
export type ChromaKeyOptions = {
    color?:     Color,
    threshold?: number,
    smoothing?: number
}

/*  the chroma-key API class  */
export default class ChromaKey {
    /*  internal configuration  */
    private options = {
        color:     new Color([ 0, 1, 0 ]),
        threshold: 0.30,
        smoothing: 0.10
    } as Required<ChromaKeyOptions>

    /*  internal state  */
    private active = false

    /*  API class constructor  */
    constructor (options = {} as ChromaKeyOptions) {
        if (options.color     !== undefined) this.options.color     = options.color
        if (options.threshold !== undefined) this.options.threshold = options.threshold
        if (options.smoothing !== undefined) this.options.smoothing = options.smoothing
    }

    /*  process a MediaStream  */
    process (inStream: MediaStream) {
        /*  determine tracks of media stream  */
        const vTracks = inStream.getVideoTracks()
        const aTracks = inStream.getAudioTracks()

        /*  ensure that video track exists  */
        const vTrack = vTracks[0]
        if (vTrack === null)
            throw new Error("could not get video track")

        /*  create an off-screen rendering canvas  */
        const canvas = new OffscreenCanvas(1, 1)
        const ctx = canvas.getContext("2d", {
            desynchronized:     true,
            willReadFrequently: true
        })
        if (ctx === null)
            throw new Error("could not get context from canvas")

        /*  helper functions  */
        const clamp = (x: number, l = 0.0, u = 1.0) => {
            if (x < l) return l
            if (x > u) return u
            return x
        }
        const smoothstep = (l: number, u: number, x: number) => {
            x = clamp((x - l) / (u - l))
            return x * x * (3.0 - 2.0 * x)
        }
        const distance = (p0: number[], p1: number[]) =>
            Math.sqrt(p0.reduce((acc, val, i) => acc + Math.pow(val - p1[i], 2), 0))

        /*  determine helper values  */
        const chromaColVec = this.options.color.toYCC().slice(1, 2)

        /*  establish media stream processing  */
        this.active = true
        const self = this
        const options = this.options
        const vTrackProcessor = new MediaStreamTrackProcessor({ track: vTrack })
        const vTrackGenerator = new MediaStreamTrackGenerator({ kind: "video" })
        const vTransformer = new TransformStream<VideoFrame, VideoFrame>({
            async transform (videoFrame, controller) {
                if (!self.active)
                    return

                /*  ensure canvas has the same size as the video frame  */
                canvas.width  = videoFrame.displayWidth
                canvas.height = videoFrame.displayHeight

                /*  render video frame into canvas  */
                const bitmap = await createImageBitmap(videoFrame)
                ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
                bitmap.close()

                /*  gather image pixels from canvas  */
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                const { data: pixels } = imgData

                /*  apply chroma-key filter  */
                for (let i = 0; i < pixels.length; i += 4) {
                    const sampleCol = new Color([
                        pixels[i]     / 0xff,
                        pixels[i + 1] / 0xff,
                        pixels[i + 2] / 0xff
                    ])
                    const sampleColVec = sampleCol.toYCC().slice(1, 2)
                    const chromaKey = smoothstep(
                        options.threshold,
                        options.threshold + options.smoothing,
                        distance(sampleColVec, chromaColVec)
                    )
                    pixels[i + 3] *= chromaKey
                }

                /*  place image pixels back into canvas  */
                ctx.putImageData(imgData, 0, 0)

                /*  create new video frame from canvas  */
                const newBitmap = await createImageBitmap(canvas)
                const newVideoFrame = new VideoFrame(newBitmap, {
                    timestamp: videoFrame.timestamp
                })

                /*  replace video frame  */
                videoFrame.close()
                controller.enqueue(newVideoFrame)
            }
        })

        /*  chain media stream nodes  */
        vTrackProcessor.readable
            .pipeThrough(vTransformer)
            .pipeTo(vTrackGenerator.writable)

        /*  re-unite transformed video stream and original audio tracks  */
        const stream = new MediaStream([ vTrackGenerator, ...aTracks ])
        return stream
    }

    /*  destroy the chroma-key  */
    destroy () {
        this.active = false
    }
}
