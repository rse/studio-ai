/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

/*  external dependencies  */
import objectPath    from "object-path"
import { minimatch } from "minimatch"
import defaults      from "./app-common-state.yaml"

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
        speakerDevice:     string,
        pronounciation:    string
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
        speakerDevice:     string,
        pronounciation:    string
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
export const StateDefault = defaults satisfies StateType

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

