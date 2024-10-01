
<img src="https://raw.githubusercontent.com/rse/studio-ai/master/res/app-icon.svg" width="200" align="right" alt=""/>

Studio AI
=========

**Interactive Studio Artificial Intelligence**

About
-----

**Studio AI** is a client/server applications for an interactive
studio Artificial Intelligence (AI), represented by a dynamically
rendered avatar. The avatar receives its inputs through a Speech-to-Text
pipeline, performs its processings with a Text-to-Text pipleline, and
sends its outputs through a Text-to-Speech/Video pipeline.

The application, written in [TypeScript](https://www.typescriptlang.org/),
consists of a central [Node.js](https://nodejs.org)-based server component and
a HTML5 Single-Page Application (SPA) as the client component.
The client component it turn runs in two distinct modes: a
[Vue.js](https://vuejs.org/) based control mode and a avatar rendering mode.
The Speech-to-Text pipeline is based on [Deepgram](https://deepgram.com),
the Text-to-Text pipeline is based on [OpenAI ChatGPT](https://chatgpt.com),
and the Text-to-Speech/Video pipeline is based on [HeyGen](https://heygen.com).

Usage (Production)
------------------

- Under Windows/macOS/Linux install [Node.js](https://nodejs.org)
  for the server run-time, [Google Chrome](https://www.google.com/chrome)
  for the client run-time (control mode and either [OBS Studio](https://obsproject.com)
  or [vMix](https://www.vmix.com) for the client run-time (renderer mode).

- Install all dependencies:<br/>
  `npm install --production`

- Run the production build-process once:<br/>
  `npm start build`

- Run the bare server component:<br/>
  `npm start server`

- Open the client component (control mode) in Google Chrome:<br/>
  https://127.0.0.1:12345/

- Use the client component (renderer mode) in OBS Studio or vMix browser sources:<br/>
  https://127.0.0.1:12345/#/render/

Usage (Development)
-------------------

- Under Windows/macOS/Linux install [Node.js](https://nodejs.org)
  for the server run-time and [Google Chrome](https://www.google.com/chrome)
  for the client run-time (both control mode and renderer mode),
  plus [Visual Studio Code](https://code.visualstudio.com/) with its
  TypeScript, ESLint and VueJS extensions.

- Install all dependencies:<br/>
  `npm install`

- Run the development build-process once:<br/>
  `npm start build-dev`

- Run the development build-process and server component continuously:<br/>
  `npm start dev`

- Open the client component (control mode) in Google Chrome:<br/>
  https://127.0.0.1:12345/

- Open the client component (renderer mode) in Google Chrome:<br/>
  https://127.0.0.1:12345/#/render/

See Also
--------

- [TypeScript](https://www.typescriptlang.org/)
- [Vue.js](https://vuejs.org/)
- [Node.js](https://nodejs.org)
- [Deepgram](https://deepgram.com)
- [OpenAI ChatGPT](https://chatgpt.com)
- [HeyGen](https://heygen.com)

Copyright & License
-------------------

Copyright &copy; 2024 [Dr. Ralf S. Engelschall](mailto:rse@engelschall.com)<br/>
Licensed under [GPL 3.0](https://spdx.org/licenses/GPL-3.0-only)

