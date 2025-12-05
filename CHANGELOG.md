
ChangeLog
=========

1.4.3 (2025-12-05)
------------------

- UPDATE: upgraded NPM dependencies

1.4.2 (2025-10-20)
------------------

- BUGFIX: try to fix attachment handling again

1.4.1 (2025-10-20)
------------------

- BUGFIX: fix attachment handling in server for Windows (different path separators)

1.4.0 (2025-10-20)
------------------

- IMPROVEMENT: reimplement Text-to-Text code with new OpenAI Responses API for GPT-5
- IMPROVEMENT: opt-out of training for Deepgram API
- IMPROVEMENT: document the remote control possibilities
- IMPROVEMENT: provide my standard prompts as external markdown files
- BUGFIX: fix typo in CSS coloring
- BUGFIX: fix HeyGen avatar shutdown procedure
- UPDATE: the available OpenAI model and their pricing
- UPDATE: upgraded dependencies

1.3.0 (2025-05-18)
------------------

- UPDATE: upgraded dependencies
- UPDATE: update Deepgram, OpenAI and HeyGen models
- BUGFIX: fix CSS properties in control UI
- BUGFIX: fix OpenAI API usage after recent changes

1.2.0 (2024-10-19)
------------------

- IMPROVEMENT: finally switched to ESLint version 9
- IMPROVEMENT: finally upgraded to HTMLLint 8
- UPDATE: upgraded dependencies

1.1.6 (2024-10-16)
------------------

- BUGFIX: allow pressing the LISTEN button just after a grace period
- BUGFIX: ensure that no old AUTO-INJECT pollings are pending
- UPDATE: upgrade dependencies

1.1.5 (2024-10-16)
------------------

- BUGFIX: fix audio meter of Speech-to-Text component

1.1.4 (2024-10-13)
------------------

- CLEANUP: patch @typescript-eslint/typescript-estree to stop displaying large warnings
- CLEANUP: improve default configuration
- CLEANUP: fix dates in README
- UPDATE: upgrade dependencies

1.1.3 (2024-10-13)
------------------

- BUGFIX: fix building server under production mode

1.1.2 (2024-10-13)
------------------

- IMPROVEMENT: allow multiple files to be uploaded multiple times
- CLEANUP: package.json dependency sorting
- CLEANUP: small CSS glitches

1.1.1 (2024-10-13)
------------------

- IMPROVEMENT: track traffic of the three engines, too
- CLEANUP: add missing files
- CLEANUP: remove items from TODO

1.1.0 (2024-10-12)
------------------

- IMPROVEMENT: allow Text-to-Text engine to use both OpenAI Completion AI and Assistant API
- IMPROVEMENT: allow attachments to be send to Text-to-Text engine
- IMPROVEMENT: disable settings tab when corresponding engine is active
- IMPROVEMENT: perform a full open/close operation for all three engines
- IMPROVEMENT: better optical traffic indicators in status bar
- IMPROVEMENT: use WebSocket connection for regular command events
- IMPROVEMENT: pass-through render log messages to control client
- IMPROVEMENT: switch to Mousetrap for key events and use CTRL+<num>
- BUGFIX: do not copy ".map" files in build process for production builds
- BUGFIX: fix pronunciation mapping in T2S engine
- CLEANUP: log the peer information (client mode) in server
- UPDATE: upgrade dependencies

1.0.7 (2024-10-08)
------------------

- IMPROVEMENT: allow StreamDeck to communicate via WebSocket, too
- IMPROVEMENT: allow auto-toggles on control UI to be remote controlled, too
- BUGFIX: be more robust at WebSocket notify handling

1.0.6 (2024-10-07)
------------------

- IMPROVEMENT: allow one to use the REST API of the server to control the UI
- IMPROVEMENT: allow one to use keystrokes to control the UI
- IMPROVEMENT: send HeyGen a pseudo task regularly to keep connection alive
- IMPROVEMENT: support text replacement in text-to-speech for better pronouncation
- BUGFIX: fix startup scripts
- BUGFIX: fix text-area scrolling under Windows
- BUGFIX: avoid outlines for sections/tabs
- UPDATE: upgrade dependencies

1.0.5 (2024-10-06)
------------------

- IMPROVEMENT: mark the last answer of the AI optically more prominent
- BUGFIX: fix auto-inject feature
- BUGFIX: reduce HeyGen voice rate to not cut words
- CLEANUP: at least English and German language is supported

1.0.4 (2024-10-06)
------------------

- IMPROVEMENT: improve default configuration
- IMPROVEMENT: updated architecture diagram
- UPDATE: upgrade dependencies

1.0.3 (2024-10-06)
------------------

- IMPROVEMENT: switch input fields with API tokens to type "password" to not expose them visually
- IMPROVEMENT: provide more screenshots
- CLEANUP: annotate HeyGen avatars in a more comprehensible way
- BUGFIX: fix coloring of flow-right arrow under recording state

1.0.2 (2024-10-06)
------------------

- IMPROVEMENT: build server also via Vite (to support YAML file loading, etc)
- IMPROVEMENT: move default state config values into separate YAML file
- BUGFIX: fix SVG loading in control UI
- CLEANUP: identify client and server in a consistent way

1.0.1 (2024-10-05)
------------------

- IMPROVEMENT: add optical flow arrows in control UI
- IMPROVEMENT: improve description of app in README.md
- IMPROVEMENT: add architecture overview
- CLEANUP: rename sources files for more clear filesystem structure
- UPDATE: upgrade dependencies

1.0.0 (2024-10-05)
------------------

(first stable release after 44 hours of hacking)

