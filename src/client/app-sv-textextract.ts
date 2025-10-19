/*
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
*/

/*  import external dependencies  */
import { EventEmitter }       from "events"
import { readPdfText }        from "pdf-text-reader"
import * as pdfjs             from "pdfjs-dist"
import pdfjsWorker            from "pdfjs-dist/build/pdf.worker.mjs?url"
import { remark }             from "remark"
import stripMarkdown          from "strip-markdown"
import { htmlToText }         from "html-to-text"
import mammoth                from "mammoth"
import { jsonToPlainText }    from "json-to-plain-text"
import { fileTypeFromBuffer } from "file-type"

/*  ensure pdf-text-reader's underlying PDFjs works as expected  */
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

/*  internal handler definition  */
type Handlers = {
    ext:    string,
    type:   string,
    handler (content: ArrayBuffer, log: (level: string, msg: string) => void): Promise<string>
}

/*  the API class  */
export default class TextExtract extends EventEmitter {
    /*  internal text extraction handlers  */
    private static handlers: Handlers[] = [ {
        ext: "txt", type: "text/plain",
        async handler (content) {
            /*  treat as plain text  */
            const decoder = new TextDecoder()
            return decoder.decode(content)
        }
    }, {
        ext: "md", type: "text/markdown",
        async handler (content) {
            /*  extract text from MD (Markdown) format  */
            const decoder = new TextDecoder()
            const markdown = decoder.decode(content)
            const vfile = await remark().use(stripMarkdown).process(markdown)
            return vfile.toString()
        }
    }, {
        ext: "html", type: "text/html",
        async handler (content) {
            /*  extract text from HTML (HyperText Markup Language) format  */
            const decoder = new TextDecoder()
            const html = decoder.decode(content)
            return htmlToText(html)
        }
    }, {
        ext: "json", type: "application/json",
        async handler (content) {
            /*  extract text from JSON (JavaScript Object Notation) format  */
            return jsonToPlainText(content, {
                spacing:                false,
                seperator:              ":",
                squareBracketsForArray: false,
                doubleQuotesForKeys:    false,
                doubleQuotesForValues:  false
            })
        }
    }, {
        ext: "pdf",  type: "application/pdf",
        async handler (content, log) {
            /*  extract text from PDF (Portable Document Format) format  */
            return readPdfText({ data: content.slice(0) }).catch((err: Error) => {
                log("WARNING", `text extraction from PDF failed: ${err}`)
                return ""
            })
        }
    }, {
        ext: "docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        async handler (content) {
            /*  extract text from DOCX (Word) format  */
            const result = await mammoth.extractRawText({ arrayBuffer: content })
            return result.value
        }
    } ]

    /*  return list of supported file extensions */
    static get supportedFileExts () {
        return this.handlers.map((entry) => entry.ext)
    }

    /*  return list of supported MIME types  */
    static get supportedMimeTypes () {
        return this.handlers.map((entry) => entry.type)
    }

    /*  return list of supported HTML accept types  */
    static get supportedHtmlAccept () {
        return this.handlers.map((entry) => `.${entry.ext}, ${entry.type}`).join(", ")
    }

    /*  minimum logging handling  */
    log (level: string, msg: string) {
        this.emit("log", level, msg)
    }

    /*  text extraction API method  */
    async textExtract (filename: string, content: ArrayBuffer) {
        /*  determine filename extension and/or content MIME type  */
        let ext  = ""
        let type = ""
        const m = filename.match(/^.+\.([^.]+)$/)
        if (m !== null)
            ext = m[1]
        const fileType = await fileTypeFromBuffer(content)
        if (fileType !== undefined) {
            ext  = fileType.ext
            type = fileType.ext
        }

        /*  find text extraction handler  */
        let text = ""
        let handled = false
        for (const entry of TextExtract.handlers) {
            if (entry.ext === ext || entry.type === type) {
                text = await entry.handler(content, (level, msg) => {
                    this.log(level, msg)
                })
                handled = true
                break
            }
        }

        /*  fallback with plain text handler  */
        if (!handled)
            text = await TextExtract.handlers.find((entry) => entry.ext === "txt")!
                .handler(content, (level, msg) => { this.log(level, msg) })

        return text
    }
}
