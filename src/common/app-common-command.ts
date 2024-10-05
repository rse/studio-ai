/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

export type CommandType = {
    cmd:  string,
    args: any[]
}

export const CommandSchema = `{
    cmd: string,
    args: [any*]
}`

