/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

import path  from "node:path"
import yargs from "yargs"
import Pkg   from "./app-util-pkg"

export default class Argv {
    public help       = false
    public version    = false
    public logLevel   = 0
    public logFile    = ""
    public stateDir   = ""
    public httpAddr   = ""
    public httpPort   = 0
    constructor (
        private pkg: Pkg
    ) {}
    async init () {
        /*  command-line option parsing  */
        // @ts-ignore
        const args = yargs()
            /* eslint @stylistic/indent: off */
            .usage(
                "Usage: $0 [-h] [-V] " +
                "[-v <log-level>] [-l|--log-file <log-file>] " +
                "[-s <state-dir>] " +
                "[-a <http-addr>] [-p <http-port>]"
            )
            .help("h").alias("h", "help").default("h", false)
                .describe("h", "show usage help")
            .boolean("V").alias("V", "version").default("V", false)
                .describe("V", "show program version information")
            .number("v").nargs("v", 1).alias("v", "log-level").default("v", 2)
                .describe("v", "level for verbose logging (0-3)")
            .string("l").nargs("l", 1).alias("l", "log-file").default("l", "-")
                .describe("l", "file for verbose logging")
            .string("s").nargs("s", 1).alias("s", "state-dir").default("s", path.join(__dirname, "../../var"))
                .describe("s", "directory of state files")
            .string("a").nargs("a", 1).alias("a", "http-addr").default("a", "0.0.0.0")
                .describe("a", "HTTP/Websocket listen IP address")
            .number("p").nargs("p", 1).alias("p", "http-port").default("p", 8080)
                .describe("p", "HTTP/Websocket listen TCP port")
            .version(false)
            .strict()
            .showHelpOnFail(true)
            .demand(0)
            .parse(process.argv.slice(2)) as any

        /*  shuffle results  */
        this.help       = args.help
        this.version    = args.version
        this.logLevel   = args.logLevel
        this.logFile    = args.logFile
        this.stateDir   = args.stateDir
        this.httpAddr   = args.httpAddr
        this.httpPort   = args.httpPort

        /*  short-circuit processing of "-V" command-line option  */
        if (this.version) {
            process.stderr.write(`${this.pkg.name} ${this.pkg.version} <${this.pkg.homepage}>\n`)
            process.stderr.write(`${this.pkg.description}\n`)
            process.stderr.write(`Copyright (c) 2024 ${this.pkg.authorName} <${this.pkg.authorUrl}>\n`)
            process.stderr.write(`Licensed under ${this.pkg.license} <http://spdx.org/licenses/${this.pkg.license}.html>\n`)
            process.exit(0)
        }
    }
}

