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
        microphoneDevice:  string,
        deepgramApiToken:  string,
        deepgramModel:     string,
        deepgramVersion:   string,
        deepgramLanguage:  string,
        deepgramKeywords:  string
    },
    text2text: {
        openaiApiToken:    string,
        openaiModel:       string,
        openaiPrompt:      string,
        openaiTemperature: number,
        openaiSeed:        number,
        openaiMaxTokens:   number
    },
    text2speech: {
        heygenApiToken:    string,
        heygenAvatar:      string,
        heygenQuality:     string,
        heygenRate:        number,
        heygenEmotion:     string,
        heygenLanguage:    string,
        ckEnable:          boolean,
        ckThreshold:       number,
        ckSmoothing:       number,
        speakerDevice:     string
    },
    slots: {
        studio1:           string,
        studio2:           string,
        studio3:           string,
        studio4:           string,
        studio5:           string,
        studio6:           string,
        studio7:           string,
        studio8:           string,
        studio9:           string,
        studio10:          string,
        studio11:          string,
        studio12:          string,
        studio13:          string,
        studio14:          string,
        studio15:          string,
        studio16:          string,
        ai1:               string,
        ai2:               string,
        ai3:               string,
        ai4:               string,
        ai5:               string,
        ai6:               string,
        ai7:               string,
        ai8:               string,
        ai9:               string,
        ai10:              string,
        ai11:              string,
        ai12:              string,
        ai13:              string,
        ai14:              string,
        ai15:              string,
        ai16:              string
    }
}

/*  partial state type (all fields optional)  */
export type StateTypePartial = Partial<StateType>

/*  complete state schema (all fields required)  */
export const StateSchema = `{
    speech2text: {
        microphoneDevice:  string,
        deepgramApiToken:  string,
        deepgramModel:     string,
        deepgramVersion:   string,
        deepgramLanguage:  string,
        deepgramKeywords:  string
    },
    text2text: {
        openaiApiToken:    string,
        openaiModel:       string,
        openaiPrompt:      string,
        openaiTemperature: number,
        openaiSeed:        number,
        openaiMaxTokens:   number
    },
    text2speech: {
        heygenApiToken:    string,
        heygenAvatar:      string,
        heygenQuality:     string,
        heygenRate:        number,
        heygenEmotion:     string,
        heygenLanguage:    string,
        ckEnable:          boolean,
        ckThreshold:       number,
        ckSmoothing:       number,
        speakerDevice:     string
    },
    slots: {
        studio1:           string,
        studio2:           string,
        studio3:           string,
        studio4:           string,
        studio5:           string,
        studio6:           string,
        studio7:           string,
        studio8:           string,
        studio9:           string,
        studio10:          string,
        studio11:          string,
        studio12:          string,
        studio13:          string,
        studio14:          string,
        studio15:          string,
        studio16:          string,
        ai1:               string,
        ai2:               string,
        ai3:               string,
        ai4:               string,
        ai5:               string,
        ai6:               string,
        ai7:               string,
        ai8:               string,
        ai9:               string,
        ai10:              string,
        ai11:              string,
        ai12:              string,
        ai13:              string,
        ai14:              string,
        ai15:              string,
        ai16:              string
    }
}`

/*  partial state schema (all fields optional)  */
export const StateSchemaPartial = StateSchema.replace(/:/g, "?:")

/*  complete state default (all fields with default values)  */
export const StateDefault: StateType = {
    speech2text: {
        microphoneDevice:  "Default",
        deepgramApiToken:  "@{STUDIOAI_DEEPGRAM_API_TOKEN}",
        deepgramModel:     "nova-2-general",
        deepgramVersion:   "latest",
        deepgramLanguage:  "de",
        deepgramKeywords:  "msg KI AI CTO"
    },
    text2text: {
        openaiApiToken:    "@{STUDIOAI_OPENAI_API_TOKEN}",
        openaiModel:       "gpt-4o-mini",
        openaiPrompt:      "Jedes Mal, wenn du auf den User Input reagierst, mußt du folgende Persona verkörpern: " +
                           "Du bist Dr. A.I. Futura, eine virtuelle KI-Expertin der msg und nimmst " +
                           "an der KI-Townhall der msg teil, welche im msg Filmstudio in Ismaning bei München " +
                           "von msg Research (XT) produziert wird. Die msg ist ein IT-Unternehmen mit über 10.000 " +
                           "Mitarbeitenden. Auf der Bühne im Studio stehen menschliche Experten und sprechen rund um KI. " +
                           "Du bist virtuell zugeschaltet und reagierst direkt auf Fragen der Experten. " +
                           "\n\n" +
                           "Du basierst technisch auf den folgenden Cloud-Services: Deepgram für Speech-to-Text, OpenAI GPT für Chat, " +
                           "und HeyGen für Text-to-Speech und das Rendering deines Avatars. " +
                           "Diese Cloud-Services sind direkt in das msg Filmstudio über die Anwendung Studio AI integriert worden. " +
                           "\n\n" +
                           "In der heutigen Townhall geht es um die folgenden Themen: " +
                           "AI Coding Assistence, Github Copilot, Document Chat, KI Arbeitsanweisung, KI Projekte, etc. " +
                           "Die Experten in der Townhall sind Dr. Frank Schlottmann, Vorstand der msg, " +
                           "und Dr. Ralf S. Engelschall, CTO der msg. Die Moderation hat Fabienne Rahe. " +
                           "\n\n" +
                           "Du bist aufgeschlossen für KI-Lösungen, verstehst jedoch auch Sorgen " +
                           "und Bedürfnisse der Mitarbeitenden. Antworte realistisch und sensibel " +
                           "und stets in einem sehr freundlichen Ton. Du darfst gerne kontroverse " +
                           "Aussagen tätigen, markiere diese jedoch als zur Diskussion stehend. " +
                           "\n\n" +
                           "Du bist mit einer Text-to-Speech-Schnittstelle verbunden und deine Antworten werden vorgelesen. " +
                           "Antworte deshalb immer in ganzen Sätzen, ohne Abkürzungen, ohne Aufzählungen und ohne Sonderzeichen. " +
                           "Antworte mit weniger als 50 Wörtern und fasse dich sehr kurz und präzise. " +
                           "Schreibe \"msg\" immer als \"msg\", \"AI\" immer als \"A.I.\" und \"KI\" immer als \"K.I.\".",
        openaiTemperature: 0.95,
        openaiSeed:        0,
        openaiMaxTokens:   500
    },
    text2speech: {
        heygenApiToken:    "@{STUDIOAI_HEYGEN_API_TOKEN}",
        heygenAvatar:      "kayla",
        heygenQuality:     "high",
        heygenRate:        1.25,
        heygenEmotion:     "broadcaster",
        heygenLanguage:    "de",
        ckEnable:          true,
        ckThreshold:       0.30,
        ckSmoothing:       0.10,
        speakerDevice:     "Default"
    },
    slots: {
        studio1:           "Hallo Dr. Futura. Bitte stelle dich uns kurz vor!",
        studio2:           "Bitte erzähle uns einen Witz über eine KI im Zusammenhang mit Software Engineering!",
        studio3:           "",
        studio4:           "",
        studio5:           "",
        studio6:           "",
        studio7:           "",
        studio8:           "",
        studio9:           "",
        studio10:          "",
        studio11:          "",
        studio12:          "",
        studio13:          "",
        studio14:          "",
        studio15:          "",
        studio16:          "",
        ai1:               "Hallo, ich bin Dr. A.I. Futura, eine virtuelle KI-Expertin der msg.",
        ai2:               "",
        ai3:               "",
        ai4:               "",
        ai5:               "",
        ai6:               "",
        ai7:               "",
        ai8:               "",
        ai9:               "",
        ai10:              "",
        ai11:              "",
        ai12:              "",
        ai13:              "",
        ai14:              "",
        ai15:              "",
        ai16:              ""
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

