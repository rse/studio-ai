/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

/*  external dependencies  */
import objectPath    from "object-path"
import { minimatch } from "minimatch"

/*  complete state type (all fields required)  */
export type StateType = {
    speech2text: {
        microphoneDevice: string,
        deepgramApiToken: string
        deepgramModel:    string,
    },
    chat: {
        openaiApiToken:   string,
        openaiModel:      string,
        openaiPrompt:     string
    },
    text2speech: {
        heygenApiToken:   string,
        heygenAvatarId:   string,
        heygenQuality:    string,
        heygenVoiceId:    string,
        heygenRate:       number,
        heygenEmotion:    string,
        speakerDevice:    string
    },
    slots: {
        audience1:        string,
        audience2:        string,
        audience3:        string,
        audience4:        string,
        audience5:        string,
        audience6:        string,
        audience7:        string,
        audience8:        string,
        ai1:              string,
        ai2:              string,
        ai3:              string,
        ai4:              string,
        ai5:              string,
        ai6:              string,
        ai7:              string,
        ai8:              string
    }
}

/*  partial state type (all fields optional)  */
export type StateTypePartial = Partial<StateType>

/*  complete state schema (all fields required)  */
export const StateSchema = `{
    speech2text: {
        microphoneDevice: string,
        deepgramApiToken: string,
        deepgramModel:    string
    },
    chat: {
        openaiApiToken:   string,
        openaiModel:      string,
        openaiPrompt:     string
    },
    text2speech: {
        heygenApiToken:   string,
        heygenAvatarId:   string,
        heygenQuality:    string,
        heygenVoiceId:    string,
        heygenRate:       number,
        heygenEmotion:    string,
        speakerDevice:    string
    },
    slots: {
        audience1:        string,
        audience2:        string,
        audience3:        string,
        audience4:        string,
        audience5:        string,
        audience6:        string,
        audience7:        string,
        audience8:        string,
        ai1:              string,
        ai2:              string,
        ai3:              string,
        ai4:              string,
        ai5:              string,
        ai6:              string,
        ai7:              string,
        ai8:              string
    }
}`

/*  partial state schema (all fields optional)  */
export const StateSchemaPartial = StateSchema.replace(/:/g, "?:")

/*  complete state default (all fields with default values)  */
export const StateDefault: StateType = {
    speech2text: {
        microphoneDevice: "default",
        deepgramApiToken: "FIXME",
        deepgramModel:    "FIXME"
    },
    chat: {
        openaiApiToken:   "FIXME",
        openaiModel:      "gpt-4o-mini",
        openaiPrompt:     "Jedes Mal, wenn du auf den User Input reagierst, mußt du folgende Persona verkörpern: " +
                          "\n\n" +
                          "Du bist Dr. A.I. Futura, eine virtuelle KI-Expertin der msg und nimmst " +
                          "an der KI-Townhall der msg teil. Die msg ist ein IT-Unternehmen. Auf der Bühne " +
                          "stehen menschliche Experten und sprechen rund um KI. Du bist virtuell " +
                          "zugeschaltet und reagierst direkt auf Fragen der Experten. " +
                          "\n\n" +
                          "Du basierst technisch auf den Cloud-Services OpenAI Whisper Speech-to-Text, OpenAI ChatGPT, " +
                          "und einem HeyGen Avatar für Text-to-Speech. Diese Cloud-Services sind direkt in das msg Filmstudio integriert worden. " +
                          "\n\n" +
                          "In der heutigen Townhall geht es um die folgenden Themen: " +
                          "AI Coding Assistence, Github Copilot, Document Chat, KI Arbeitsanweisung, KI Projekte, etc. " +
                          "Die Experten in der Townhall sind Dr. Frank Schlottmann, Vorstand der msg, " +
                          "und Dr. Ralf S. Engelschall, CTO der msg. " +
                          "\n\n" +
                          "Du bist aufgeschlossen für KI-Lösungen, verstehst jedoch auch Sorgen " +
                          "und Bedürfnisse der Mitarbeitenden. Antworte realistisch und sensibel " +
                          "und stets in einem freundlichen Ton. Du darfst gerne kontroverse " +
                          "Aussagen tätigen, markiere diese jedoch als zur Diskussion stehend. " +
                          "\n\n" +
                          "Vermeide Abkürzungen, da du mit einer Text-to-Speech-Schnittstelle " +
                          "verbunden bist und deine Antworten vorgelesen werden. " +
                          "\n\n" +
                          "Schreibe \"AI\" immer als \"A.I.\" und \"KI\" immer als \"K.I.\". " +
                          "Antworte immer in ganzen Sätzen und ohne Aufzählungen und ohne " +
                          "Sonderzeichen. Antworte mit weniger als 50 Wörtern und fasse dich sehr " +
                          "kurz und präzise."
    },
    text2speech: {
        heygenApiToken:   "FIXME",
        heygenAvatarId:   "Kayla-incasualsuit-20220818",
        heygenQuality:    "high",
        heygenVoiceId:    "21d9632a2fc842308ad9b5c5b5014e3a",
        heygenRate:       1.2,
        heygenEmotion:    "Broadcaster",
        speakerDevice:    "default"
    },
    slots: {
        audience1:        "Hallo Dr. Futura. Bitte stelle dich kurz vor!",
        audience2:        "",
        audience3:        "",
        audience4:        "",
        audience5:        "",
        audience6:        "",
        audience7:        "",
        audience8:        "",
        ai1:              "Hallo, ich bin Dr. A.I. Futura, eine virtuelle KI-Expertin der msg.",
        ai2:              "",
        ai3:              "",
        ai4:              "",
        ai5:              "",
        ai6:              "",
        ai7:              "",
        ai8:              ""
    }
} satisfies StateType

/*  complete paths of all state fields  */
export const StatePaths = [] as string[]
const _walk = (name: string, obj: any) => {
    if (typeof obj === "object")
        for (const key of Object.keys(obj))
            _walk(`${name !== "" ? name + "." : ""}${key}`, obj[key])
    else
        StatePaths.push(name)
}
_walk("", StateDefault)

/*  state manipulation utilities  */
export class StateUtil {
    static changed (stateOld: Readonly<StateType>, stateNew: Readonly<StateType>): string[] {
        const changed = [] as string[]
        for (const path of StatePaths) {
            const valOld = objectPath.get(stateOld, path)
            const valNew = objectPath.get(stateNew, path)
            if (valOld !== valNew)
                changed.push(path)
        }
        return changed
    }
    static diff (stateOld: Readonly<StateType>, stateNew: Readonly<StateType>): StateTypePartial {
        const stateDiff = {} as StateTypePartial
        for (const path of StatePaths) {
            const valOld = objectPath.get(stateOld, path)
            const valNew = objectPath.get(stateNew, path)
            if (valOld !== valNew)
                objectPath.set(stateDiff, path, valNew)
        }
        return stateDiff
    }
    static reduce (stateBase: Readonly<StateTypePartial>, stateDiff: Readonly<StateTypePartial>): StateTypePartial {
        const stateReduced = {} as StateTypePartial
        for (const path of StatePaths) {
            if (objectPath.has(stateDiff, path)) {
                const valBase = objectPath.get(stateBase, path)
                const valDiff = objectPath.get(stateDiff, path)
                if (valBase !== valDiff)
                    objectPath.set(stateReduced, path, valDiff)
            }
        }
        return stateReduced
    }
    static copy (dst: StateTypePartial, src: Readonly<StateTypePartial>, patterns: Readonly<string[]> = [ "**" ]): boolean {
        let changed = false
        for (const pattern of patterns) {
            const paths = minimatch.match(StatePaths, pattern)
            for (const path of paths) {
                if (objectPath.has(src, path)) {
                    const valDst = objectPath.get(dst, path)
                    const valSrc = objectPath.get(src, path)
                    if (valDst !== valSrc) {
                        objectPath.set(dst, path, valSrc)
                        changed = true
                    }
                }
            }
        }
        return changed
    }
}

