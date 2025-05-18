<!--
**
**  Studio-AI - Interactive Studio Artificial Intelligence
**  Copyright (c) 2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under GPL 3.0 <https://spdx.org/licenses/GPL-3.0-only>
**
-->

<template>
    <div class="app-control">
        <!--  HEADER  -->
        <div class="head">
            <img class="logo" src="../../res/app-icon.svg?url" alt="" />
            <b>Studio AI</b> Control
        </div>

        <!--  BODY  -->
        <div class="body">
            <tabs ref="tabs" v-bind:options="{ useUrlFragment: false }" v-bind:cache-lifetime="0" class="tabs-level-1" v-on:changed="tabChanged0">
                <!--  ==== SETTINGS ====  -->
                <tab id="settings" name="Settings">
                    <tabs ref="settings" v-bind:options="{ useUrlFragment: false }" v-bind:cache-lifetime="0" class="tabs-level-2" v-on:changed="tabChanged1">
                        <!--  ==== SETTINGS: S2T ====  -->
                        <tab id="s2t" name="Speech-to-Text (S2T)">
                            <div class="desc">
                                These are the settings for the <b>Speech-to-Text (S2T)</b> engine,
                                based on the <b>Deepgram</b> AI cloud service.
                                <br/>
                                The S2T engine runs inside the <b>Studio AI</b> <b>control</b> client.
                                <div class="control-disabled" v-show="engine.speech2text > 0">
                                    The S2T engine is currently running. In order to
                                    re-configure it here, please stop it first under <b>Control</b>.
                                </div>
                            </div>
                            <div class="control" v-bind:class="{ disabled: engine.speech2text > 0 }">
                                <div class="label1">input</div>
                                <div class="label2">(microphone)</div>
                                <div class="label3">[device]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.speech2text.microphoneDevice = stateDefault.speech2text.microphoneDevice">RESET</div>
                                <div class="input">
                                    <input class="text" v-model.lazy="state.speech2text.microphoneDevice"/>
                                </div>

                                <div class="label1">deepgram</div>
                                <div class="label2">(API)</div>
                                <div class="label3">[token]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.speech2text.deepgramApiToken = stateDefault.speech2text.deepgramApiToken">RESET</div>
                                <div class="input">
                                    <input class="text" v-model.lazy="state.speech2text.deepgramApiToken" type="password"/>
                                </div>

                                <div class="label1">deepgram</div>
                                <div class="label2">(model)</div>
                                <div class="label3">[id]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.speech2text.deepgramModel = stateDefault.speech2text.deepgramModel">RESET</div>
                                <div class="input">
                                    <Multiselect class="multiselect"
                                        v-bind:searchable="true"    v-bind:required="true"
                                        v-bind:can-deselect="false" v-bind:can-clear="false"
                                        v-model.lazy="state.speech2text.deepgramModel"
                                        v-bind:options="[
                                            { label: 'Nova-2 ($0.0043/min)', value: 'nova-2-general' },
                                            { label: 'Nova-3 ($0.0052/min)', value: 'nova-3-general' }
                                        ]"
                                    />
                                </div>

                                <div class="label1">deepgram</div>
                                <div class="label2">(version)</div>
                                <div class="label3">[string]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.speech2text.deepgramVersion = stateDefault.speech2text.deepgramVersion">RESET</div>
                                <div class="input">
                                    <input class="text" v-model.lazy="state.speech2text.deepgramVersion"/>
                                </div>

                                <div class="label1">deepgram</div>
                                <div class="label2">(language)</div>
                                <div class="label3">[iso-code]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.speech2text.deepgramLanguage = stateDefault.speech2text.deepgramLanguage">RESET</div>
                                <div class="input">
                                    <Multiselect class="multiselect"
                                        v-bind:searchable="true"    v-bind:required="true"
                                        v-bind:can-deselect="false" v-bind:can-clear="false"
                                        v-model.lazy="state.speech2text.deepgramLanguage"
                                        v-bind:options="[
                                            { label: 'EN (English)', value: 'en' },
                                            { label: 'DE (German)',  value: 'de' }
                                        ]"
                                    />
                                </div>

                                <div class="label1">deepgram</div>
                                <div class="label2">(keywords)</div>
                                <div class="label3">[string]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.speech2text.deepgramKeywords = stateDefault.speech2text.deepgramKeywords">RESET</div>
                                <div class="input">
                                    <input class="text" v-model.lazy="state.speech2text.deepgramKeywords"/>
                                </div>

                                <div class="control-overlay" v-show="engine.speech2text > 0"></div>
                            </div>
                        </tab>

                        <!--  ==== SETTINGS: T2T ====  -->
                        <tab id="t2t" name="Text-to-Text (T2T)">
                            <div class="desc">
                                These are the settings for the <b>Text-to-Text (T2T)</b> engine,
                                based on the <b>OpenAI GPT</b> AI cloud service.
                                <br/>
                                The T2T engine runs inside the <b>Studio AI</b> <b>control</b> client.
                                <div class="control-disabled" v-show="engine.text2text > 0">
                                    The T2T engine is currently running. In order to
                                    re-configure it here, please stop it first under <b>Control</b>.
                                </div>
                            </div>
                            <div class="control" v-bind:class="{ disabled: engine.text2text > 0 }">
                                <div class="label1">openai</div>
                                <div class="label2">(api)</div>
                                <div class="label3">[token]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.text2text.openaiApiToken = stateDefault.text2text.openaiApiToken">RESET</div>
                                <div class="input">
                                    <input class="text" v-model.lazy="state.text2text.openaiApiToken" type="password"/>
                                </div>

                                <div class="label1">openai</div>
                                <div class="label2">(model)</div>
                                <div class="label3">[id]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.text2text.openaiModel = stateDefault.text2text.openaiModel">RESET</div>
                                <div class="input">
                                    <Multiselect class="multiselect"
                                        v-bind:searchable="true"    v-bind:required="true"
                                        v-bind:can-deselect="false" v-bind:can-clear="false"
                                        v-model.lazy="state.text2text.openaiModel"
                                        v-bind:options="[
                                            { label: 'GPT-4.1      [2025-04] ($2.00/1Mit, $8.00/1Mot)',   value: 'gpt-4.1' },
                                            { label: 'GPT-4.1-Mini [2025-04] ($0.40/1Mit, $1.60/1Mot)',   value: 'gpt-4.1-mini' },
                                            { label: 'GPT-4.1-Nano [2025-04] ($0.10/1Mit, $0.40/1Mot)',   value: 'gpt-4.1-nano' },
                                            { label: 'o3           [2025-04] ($10.00/1Mit, $40.00/1Mot)', value: 'o3' },
                                            { label: 'o3-Mini      [2025-01] ($1.10/1Mit, $4.40/1Mot)',   value: 'o3-mini' },
                                            { label: 'o4-Mini      [2025-04] ($1.10/1Mit, $4.40/1Mot)',   value: 'o4-mini' },
                                            { label: 'GPT-4o       [2024-08] ($2.50/1Mit, $10.00/1Mot)',  value: 'gpt-4o' },
                                            { label: 'GPT-4o-Mini  [2024-07] ($0.15/1Mit, $0.60/1Mot)',   value: 'gpt-4o-mini' },
                                            { label: 'ChatGPT-4o   [2025-05] ($5.00/1Mit, $15.00/1Mot)',  value: 'chatgpt-4o-latest' }
                                        ]"
                                    />
                                </div>

                                <div class="label1">openai</div>
                                <div class="label2">(temperature)</div>
                                <div class="label3">[number]:</div>
                                <div class="value">
                                    <input tabindex="8" v-bind:value="fieldExport(state.text2text.openaiTemperature)"
                                        v-on:change="(ev) => state.text2text.openaiTemperature = fieldImport((ev.target! as HTMLInputElement).value, 0.0, 2.0)"/>
                                </div>
                                <div class="button" v-on:click="state.text2text.openaiTemperature = stateDefault.text2text.openaiTemperature">RESET</div>
                                <div class="input">
                                    <slider class="slider" v-model="state.text2text.openaiTemperature"
                                        v-bind:min="0.0" v-bind:max="2.0" v-bind:step="0.05"
                                        v-bind:disabled="engine.text2text > 0"
                                        show-tooltip="drag" v-bind:format="formatSliderValue" v-bind:lazy="false"
                                    ></slider>
                                </div>

                                <div class="label1">openai</div>
                                <div class="label2">(seed)</div>
                                <div class="label3">[number]:</div>
                                <div class="value">
                                    <input tabindex="8" v-bind:value="fieldExport(state.text2text.openaiSeed)"
                                        v-on:change="(ev) => state.text2text.openaiSeed = fieldImport((ev.target! as HTMLInputElement).value, 0, 100)"/>
                                </div>
                                <div class="button" v-on:click="state.text2text.openaiSeed = stateDefault.text2text.openaiSeed">RESET</div>
                                <div class="input">
                                    <slider class="slider" v-model="state.text2text.openaiSeed"
                                        v-bind:min="0" v-bind:max="100" v-bind:step="1"
                                        v-bind:disabled="engine.text2text > 0"
                                        show-tooltip="drag" v-bind:format="formatSliderValue" v-bind:lazy="false"
                                    ></slider>
                                </div>

                                <div class="label1">openai</div>
                                <div class="label2">(max-tokens)</div>
                                <div class="label3">[number]:</div>
                                <div class="value">
                                    <input tabindex="8" v-bind:value="fieldExport(state.text2text.openaiMaxTokens)"
                                        v-on:change="(ev) => state.text2text.openaiMaxTokens = fieldImport((ev.target! as HTMLInputElement).value, 10, 1000)"/>
                                </div>
                                <div class="button" v-on:click="state.text2text.openaiMaxTokens = stateDefault.text2text.openaiMaxTokens">RESET</div>
                                <div class="input">
                                    <slider class="slider" v-model="state.text2text.openaiMaxTokens"
                                        v-bind:min="10" v-bind:max="1000" v-bind:step="10"
                                        v-bind:disabled="engine.text2text > 0"
                                        show-tooltip="drag" v-bind:format="formatSliderValue" v-bind:lazy="false"
                                    ></slider>
                                </div>

                                <div class="label1">openai</div>
                                <div class="label2">(api)</div>
                                <div class="label3">[type]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.text2text.openaiApiType = stateDefault.text2text.openaiApiType">RESET</div>
                                <div class="input apitype">
                                    <div class="button" v-bind:class="{ selected: state.text2text.openaiApiType === 'completion' }" v-on:click="state.text2text.openaiApiType = 'completion'">Completion</div>
                                    <div class="button" v-bind:class="{ selected: state.text2text.openaiApiType === 'assistant' }"  v-on:click="state.text2text.openaiApiType = 'assistant'">Assistant</div>
                                </div>

                                <div class="label1">openai</div>
                                <div class="label2">(attachment)</div>
                                <div class="label3">[files]:</div>
                                <div class="value">
                                    <div class="fixed">{{ attachmentCount }}</div>
                                </div>
                                <div class="button" v-on:click="state.text2text.openaiAttachment = stateDefault.text2text.openaiAttachment">RESET</div>
                                <div class="input attachment">
                                    <div class="attachment-action">
                                        <div class="button" v-on:click="($refs.attachmentInput as any).click()">UPLOAD</div>
                                        <div class="button" v-on:click="openaiAttachmentClear()">CLEAR</div>
                                        <input ref="attachmentInput"
                                            class="attachment-input"
                                            type="file"
                                            v-bind:multiple="true"
                                            v-bind:accept="openaiMimeTypes"
                                            v-on:change="openaiAttachmentChange"/>
                                    </div>
                                    <div class="attachment-files" v-show="attachmentFilenames.length > 0">
                                        <div class="attachment-file" v-for="filename, i of attachmentFilenames" v-bind:key="i">
                                            {{ filename }}
                                        </div>
                                    </div>
                                </div>

                                <div class="label1">openai</div>
                                <div class="label2">(prompt)</div>
                                <div class="label3">[string]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.text2text.openaiPrompt = stateDefault.text2text.openaiPrompt">RESET</div>
                                <div class="input">
                                    <textarea class="prompt" rows="10" v-model.lazy="state.text2text.openaiPrompt"></textarea>
                                </div>

                                <div class="control-overlay" v-show="engine.text2text > 0"></div>
                            </div>
                        </tab>

                        <!--  ==== SETTINGS: T2S ====  -->
                        <tab id="t2s" name="Text-to-Speech (T2S)">
                            <div class="desc">
                                These are the settings for the <b>Text-to-Speech (T2S)</b> engine,
                                based on the <b>HeyGen</b> AI cloud service.
                                <br/>
                                The T2S engine runs inside the <b>Studio AI</b> <b>render</b> client.
                                <div class="control-disabled" v-show="engine.text2speech > 0">
                                    The T2S engine is currently running. In order to
                                    re-configure it here, please stop it first under <b>Control</b>.
                                </div>
                            </div>
                            <div class="control" v-bind:class="{ disabled: engine.text2speech > 0 }">
                                <div class="label1">heygen</div>
                                <div class="label2">(API)</div>
                                <div class="label3">[token]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.text2speech.heygenApiToken = stateDefault.text2speech.heygenApiToken">RESET</div>
                                <div class="input">
                                    <input class="text" v-model.lazy="state.text2speech.heygenApiToken" type="password"/>
                                </div>

                                <div class="label1">heygen</div>
                                <div class="label2">(avatar id)</div>
                                <div class="label3">[id]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.text2speech.heygenAvatar = stateDefault.text2speech.heygenAvatar">RESET</div>
                                <div class="input">
                                    <Multiselect class="multiselect"
                                        v-bind:searchable="true"    v-bind:required="true"
                                        v-bind:can-deselect="false" v-bind:can-clear="false"
                                        v-model.lazy="state.text2speech.heygenAvatar"
                                        v-bind:options="[
                                            { label: 'Kayla (very good)', value: 'kayla' },
                                            { label: 'Tyler (good)',      value: 'tyler' },
                                            { label: 'Anna (good)',       value: 'anna' },
                                            { label: 'Edward (decent)',   value: 'edward' },
                                            { label: 'Susan (decent)',    value: 'susan' }
                                        ]"
                                    />
                                </div>

                                <div class="label1">heygen</div>
                                <div class="label2">(avatar quality)</div>
                                <div class="label3">[level]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.text2speech.heygenQuality = stateDefault.text2speech.heygenQuality">RESET</div>
                                <div class="input">
                                    <Multiselect class="multiselect"
                                        v-bind:searchable="true"    v-bind:required="true"
                                        v-bind:can-deselect="false" v-bind:can-clear="false"
                                        v-model.lazy="state.text2speech.heygenQuality"
                                        v-bind:options="[
                                            { label: 'Low',    value: 'low' },
                                            { label: 'Medium', value: 'medium' },
                                            { label: 'High',   value: 'high' },
                                        ]"
                                    />
                                </div>

                                <div class="label1">heygen</div>
                                <div class="label2">(voice rate)</div>
                                <div class="label3">[number]:</div>
                                <div class="value">
                                    <input tabindex="8" v-bind:value="fieldExport(state.text2speech.heygenRate)"
                                        v-on:change="(ev) => state.text2speech.heygenRate = fieldImport((ev.target! as HTMLInputElement).value, 0.50, 1.50)"/>
                                </div>
                                <div class="button" v-on:click="state.text2speech.heygenRate = stateDefault.text2speech.heygenRate">RESET</div>
                                <div class="input">
                                    <slider class="slider" v-model="state.text2speech.heygenRate"
                                        v-bind:min="0.50" v-bind:max="1.50" v-bind:step="0.05"
                                        v-bind:disabled="engine.text2speech > 0"
                                        show-tooltip="drag" v-bind:format="formatSliderValue" v-bind:lazy="false"
                                    ></slider>
                                </div>

                                <div class="label1">heygen</div>
                                <div class="label2">(voice emotion)</div>
                                <div class="label3">[type]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.text2speech.heygenEmotion = stateDefault.text2speech.heygenEmotion">RESET</div>
                                <div class="input">
                                    <Multiselect class="multiselect"
                                        v-bind:searchable="true"    v-bind:required="true"
                                        v-bind:can-deselect="false" v-bind:can-clear="false"
                                        v-model.lazy="state.text2speech.heygenEmotion"
                                        v-bind:options="[
                                            { label: 'Broadcaster', value: 'broadcaster' },
                                            { label: 'Excited',     value: 'excited' },
                                            { label: 'Friendly',    value: 'friendly' },
                                            { label: 'Serious',     value: 'serious' },
                                            { label: 'Soothing',    value: 'soothing' }
                                        ]"
                                    />
                                </div>

                                <div class="label1">heygen</div>
                                <div class="label2">(voice language)</div>
                                <div class="label3">[iso-code]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.text2speech.heygenLanguage = stateDefault.text2speech.heygenLanguage">RESET</div>
                                <div class="input">
                                    <Multiselect class="multiselect"
                                        v-bind:searchable="true"    v-bind:required="true"
                                        v-bind:can-deselect="false" v-bind:can-clear="false"
                                        v-model.lazy="state.text2speech.heygenLanguage"
                                        v-bind:options="[
                                            { label: 'EN (English)', value: 'en' },
                                            { label: 'DE (German)',  value: 'de' }
                                        ]"
                                    />
                                </div>

                                <div class="label1">chroma-key</div>
                                <div class="label2">(enable)</div>
                                <div class="label3">[boolean]:</div>
                                <div class="value">
                                    <div class="fixed">{{ state.text2speech.ckEnable ? "YES" : "NO" }}</div>
                                </div>
                                <div class="button" v-on:click="state.text2speech.ckEnable = stateDefault.text2speech.ckEnable">RESET</div>
                                <div class="input">
                                    <toggle class="toggle" v-model="state.text2speech.ckEnable"></toggle>
                                </div>

                                <div class="label1">chroma-key</div>
                                <div class="label2">(threshold)</div>
                                <div class="label3">[number]:</div>
                                <div class="value">
                                    <input tabindex="8" v-bind:value="fieldExport(state.text2speech.ckThreshold)"
                                        v-on:change="(ev) => state.text2speech.ckThreshold = fieldImport((ev.target! as HTMLInputElement).value, 0.0, 1.0)"/>
                                </div>
                                <div class="button" v-on:click="state.text2speech.ckThreshold = stateDefault.text2speech.ckThreshold">RESET</div>
                                <div class="input">
                                    <slider class="slider" v-model="state.text2speech.ckThreshold"
                                        v-bind:min="0.0" v-bind:max="1.0" v-bind:step="0.01"
                                        v-bind:disabled="engine.text2speech > 0"
                                        show-tooltip="drag" v-bind:format="formatSliderValue" v-bind:lazy="false"
                                    ></slider>
                                </div>

                                <div class="label1">chroma-key</div>
                                <div class="label2">(smoothing)</div>
                                <div class="label3">[number]:</div>
                                <div class="value">
                                    <input tabindex="8" v-bind:value="fieldExport(state.text2speech.ckSmoothing)"
                                        v-on:change="(ev) => state.text2speech.ckSmoothing = fieldImport((ev.target! as HTMLInputElement).value, 0.0, 1.0)"/>
                                </div>
                                <div class="button" v-on:click="state.text2speech.ckSmoothing = stateDefault.text2speech.ckSmoothing">RESET</div>
                                <div class="input">
                                    <slider class="slider" v-model="state.text2speech.ckSmoothing"
                                        v-bind:min="0.0" v-bind:max="1.0" v-bind:step="0.01"
                                        v-bind:disabled="engine.text2speech > 0"
                                        show-tooltip="drag" v-bind:format="formatSliderValue" v-bind:lazy="false"
                                    ></slider>
                                </div>

                                <div class="label1">output</div>
                                <div class="label2">(speaker)</div>
                                <div class="label3">[device]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.text2speech.speakerDevice = stateDefault.text2speech.speakerDevice">RESET</div>
                                <div class="input">
                                    <input class="text" v-model.lazy="state.text2speech.speakerDevice"/>
                                </div>

                                <div class="label1">output</div>
                                <div class="label2">(pronounciation)</div>
                                <div class="label3">[string]:</div>
                                <div class="value">
                                    <div class="fixed">*</div>
                                </div>
                                <div class="button" v-on:click="state.text2speech.pronounciation = stateDefault.text2speech.pronounciation">RESET</div>
                                <div class="input">
                                    <textarea class="prompt" rows="5" v-model.lazy="state.text2speech.pronounciation"></textarea>
                                </div>

                                <div class="control-overlay" v-show="engine.text2speech > 0"></div>
                            </div>
                        </tab>
                    </tabs>
                </tab>

                <!--  ==== CONTROL ====  -->
                <tab id="control" name="Control" class="control-tab">
                    <div class="control-pane">
                        <div class="left">
                            <div class="actions">
                                <div class="button engine"
                                    v-bind:class="{ active: engine.speech2text > 0 }"
                                    v-on:click="engineToggle('speech2text')">
                                    <span v-show="engine.speech2text === 0" class="icon">
                                        <i class="fas fa-square"></i>
                                    </span>
                                    <span v-show="engine.speech2text === 1" class="icon">
                                        <i class="fas fa-gear fa-spin"></i>
                                    </span>
                                    <span v-show="engine.speech2text === 2" class="icon">
                                        <spinner-grid class="spinner-grid" size="16"/>
                                    </span>
                                    S2T
                                </div>
                                <div class="button text2text"
                                    v-bind:class="{ active: engine.text2text > 0 }"
                                    v-on:click="engineToggle('text2text')">
                                    <span v-show="engine.text2text === 0" class="icon">
                                        <i class="fas fa-square"></i>
                                    </span>
                                    <span v-show="engine.text2text === 1" class="icon">
                                        <i class="fas fa-gear fa-spin"></i>
                                    </span>
                                    <span v-show="engine.text2text === 2" class="icon">
                                        <spinner-grid class="spinner-grid" size="16"/>
                                    </span>
                                    T2T
                                </div>
                                <div class="button engine"
                                    v-bind:class="{ active: engine.text2speech > 0 }"
                                    v-on:click="engineToggle('text2speech')">
                                    <span v-show="engine.text2speech === 0" class="icon">
                                        <i class="fas fa-square"></i>
                                    </span>
                                    <span v-show="engine.text2speech === 1" class="icon">
                                        <i class="fas fa-gear fa-spin"></i>
                                    </span>
                                    <span v-show="engine.text2speech === 2" class="icon">
                                        <spinner-grid class="spinner-grid" size="16"/>
                                    </span>
                                    T2S
                                </div>
                            </div>
                            <div class="label" v-bind:class="{ 'during-recording': recording }">Studio:</div>
                            <div class="studio-text">
                                <textarea v-show="!recording" v-model="studioMessage"
                                    v-bind:disabled="recording"
                                    v-on:keydown.enter.prevent="studioInject()">
                                </textarea>
                                <div v-show="recording" class="studio-text-during-recording">
                                    {{ studioMessage }}
                                    <span v-show="!studioMessageFinal" class="icon">
                                        <spinner-grid class="spinner-grid" size="12"/>
                                    </span>
                                </div>
                            </div>
                            <div class="actions">
                                <div class="button slot" v-bind:class="{ active: studioSlot === 1, empty: state.slots.studio1 === '' }" v-on:click="studioSlotSelect(1)">1</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 2, empty: state.slots.studio2 === '' }" v-on:click="studioSlotSelect(2)">2</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 3, empty: state.slots.studio3 === '' }" v-on:click="studioSlotSelect(3)">3</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 4, empty: state.slots.studio4 === '' }" v-on:click="studioSlotSelect(4)">4</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 5, empty: state.slots.studio5 === '' }" v-on:click="studioSlotSelect(5)">5</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 6, empty: state.slots.studio6 === '' }" v-on:click="studioSlotSelect(6)">6</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 7, empty: state.slots.studio7 === '' }" v-on:click="studioSlotSelect(7)">7</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 8, empty: state.slots.studio8 === '' }" v-on:click="studioSlotSelect(8)">8</div>
                            </div>
                            <div class="actions">
                                <div class="button slot" v-bind:class="{ active: studioSlot === 9,  empty: state.slots.studio9  === '' }" v-on:click="studioSlotSelect(9)">9</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 10, empty: state.slots.studio10 === '' }" v-on:click="studioSlotSelect(10)">10</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 11, empty: state.slots.studio11 === '' }" v-on:click="studioSlotSelect(11)">11</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 12, empty: state.slots.studio12 === '' }" v-on:click="studioSlotSelect(12)">12</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 13, empty: state.slots.studio13 === '' }" v-on:click="studioSlotSelect(13)">13</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 14, empty: state.slots.studio14 === '' }" v-on:click="studioSlotSelect(14)">14</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 15, empty: state.slots.studio15 === '' }" v-on:click="studioSlotSelect(15)">15</div>
                                <div class="button slot" v-bind:class="{ active: studioSlot === 16, empty: state.slots.studio16 === '' }" v-on:click="studioSlotSelect(16)">16</div>
                            </div>
                            <div class="actions">
                                <div class="button studio-listen"
                                    v-bind:class="{ recording: recording, disabled: engine.speech2text !== 2 }"
                                    v-on:click="toggleRecording()">
                                    <div v-show="engine.speech2text !== 2" class="studio-meter-closed"></div>
                                    <canvas v-show="engine.speech2text === 2" ref="studioMeter" class="studio-meter"></canvas>
                                    <span v-show="!recording" class="icon"><i class="fas fa-circle"></i></span>
                                    <span v-show="recording" class="icon">
                                        <spinner-rings class="spinner-rings" size="30"/>
                                    </span>
                                    LISTEN
                                </div>
                                <div class="button"
                                    v-bind:class="{ disabled: studioMessage === '' || engine.text2text !== 2 }"
                                    v-on:click="studioInject()">
                                    <toggle v-on:click.stop="void(0)"
                                        class="toggle toggle-autoinject" v-model="studioAutoInject">
                                    </toggle>
                                    <i class="icon fas fa-circle-chevron-right"></i>
                                    INJECT
                                </div>
                            </div>
                            <div class="label">AI:</div>
                            <div class="ai-text">
                                <textarea v-model="aiMessage"
                                    class="ai-text"
                                    v-on:keydown.enter.prevent="aiSpeak()">
                                </textarea>
                            </div>
                            <div class="actions">
                                <div class="button slot" v-bind:class="{ active: aiSlot === 1, empty: state.slots.ai1 === '' }" v-on:click="aiSlotSelect(1)">1</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 2, empty: state.slots.ai2 === '' }" v-on:click="aiSlotSelect(2)">2</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 3, empty: state.slots.ai3 === '' }" v-on:click="aiSlotSelect(3)">3</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 4, empty: state.slots.ai4 === '' }" v-on:click="aiSlotSelect(4)">4</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 5, empty: state.slots.ai5 === '' }" v-on:click="aiSlotSelect(5)">5</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 6, empty: state.slots.ai6 === '' }" v-on:click="aiSlotSelect(6)">6</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 7, empty: state.slots.ai7 === '' }" v-on:click="aiSlotSelect(7)">7</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 8, empty: state.slots.ai8 === '' }" v-on:click="aiSlotSelect(8)">8</div>
                            </div>
                            <div class="actions">
                                <div class="button slot" v-bind:class="{ active: aiSlot === 9,  empty: state.slots.ai9  === '' }" v-on:click="aiSlotSelect(9)">9</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 10, empty: state.slots.ai10 === '' }" v-on:click="aiSlotSelect(10)">10</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 11, empty: state.slots.ai11 === '' }" v-on:click="aiSlotSelect(11)">11</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 12, empty: state.slots.ai12 === '' }" v-on:click="aiSlotSelect(12)">12</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 13, empty: state.slots.ai13 === '' }" v-on:click="aiSlotSelect(13)">13</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 14, empty: state.slots.ai14 === '' }" v-on:click="aiSlotSelect(14)">14</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 15, empty: state.slots.ai15 === '' }" v-on:click="aiSlotSelect(15)">15</div>
                                <div class="button slot" v-bind:class="{ active: aiSlot === 16, empty: state.slots.ai16 === '' }" v-on:click="aiSlotSelect(16)">16</div>
                            </div>
                            <div class="actions">
                                <div class="button ai-speak"
                                    v-bind:class="{ disabled: aiMessage == '' || engine.text2speech !== 2, speaking: speaking }"
                                    v-on:click="aiSpeak()">
                                    <toggle v-on:click.stop="void(0)"
                                        class="toggle toggle-autospeak" v-model="aiAutoSpeak">
                                    </toggle>
                                    <span v-show="!speaking" class="icon"><i class="fas fa-play"></i></span>
                                    <span v-show="speaking" class="icon">
                                        <spinner-bars class="spinner-bars" size="16"/>
                                    </span>
                                    <span v-show="!speaking">SPEAK</span>
                                    <span v-show="speaking">STOP</span>
                                </div>
                                <div class="button ai-extract"
                                    v-bind:class="{ disabled: engine.text2text !== 2 || !aiExtractable() }"
                                    v-on:click="aiExtract()">
                                    <toggle v-on:click.stop="void(0)"
                                        class="toggle toggle-autoextract" v-model="aiAutoExtract">
                                    </toggle>
                                    <i class="icon fas fa-circle-chevron-left"></i>
                                    EXTRACT
                                </div>
                            </div>
                        </div>
                        <div class="middle">
                            <div class="upper">
                                <div class="flow-right" v-bind:class="{ active: recording }" v-html="svgShapeFlow"></div>
                            </div>
                            <div class="lower">
                                <div class="flow-left"  v-html="svgShapeFlow"></div>
                            </div>
                        </div>
                        <div ref="right" class="right">
                            <div class="text2text-history">
                                <div v-for="entry, i of text2textLog" v-bind:key="i" class="text2text-entry"
                                    v-bind:class="{ [ 'text2text-entry-' + entry.persona.toLowerCase() ]: true }">
                                    <div class="text2text-entry-persona">{{ entry.persona }}:</div>
                                    <div class="text2text-entry-message">
                                        {{ entry.message }}
                                        <span v-show="!entry.final" class="text2text-entry-message-dots">
                                            &nbsp; <spinner-grid class="spinner-grid" size="14"/>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </tab>

                <!--  ==== RENDER ====  -->
                <tab id="render" name="Render" class="render">
                    <div class="desc">
                        This allows you to access the <b>Studio AI</b> <b>render</b> client, the interactive avatar.<br/>
                        It has to be opened in a dedicated browser context, which usually is
                        either a <b>vMix</b> browser input or an <b>OBS Studio</b> browser source.
                    </div>
                    <div class="preview-url" v-on:click="previewCopy()">
                        {{ `${serviceUrl}#/render` }}
                    </div>
                    <div class="preview-control">
                        <div class="action">
                            <div class="button" v-on:click="previewOpen()">OPEN</div>
                            <div class="button" v-on:click="previewCopy()">COPY</div>
                        </div>
                    </div>
                </tab>
            </tabs>
        </div>

        <!--  FOOTER  -->
        <div class="foot" v-bind:class="{
            error:   status.kind === 'error',
            warning: status.kind === 'warning',
            info:    status.kind === 'info'
        }">
            <!--  Application Status Information  -->
            <div class="status">
                {{ status.kind === '' ? `${pkg.name} ${pkg.version} (${pkg["x-date"]})` : status.msg }}
            </div>

            <!--  Server Connection Information  -->
            <div class="connection">
                <!--  Online  -->
                <div class="online yes" v-show="connection.online">
                    <i class="fa-solid fa-plug-circle-check"></i>
                </div>
                <div class="online no" v-show="!connection.online">
                    <i class="fa-solid fa-plug-circle-xmark"></i>
                </div>

                <!--  Traffic Send  -->
                <div class="traffic send" v-bind:class="{ active: connection.send }">
                    <i class="fa-solid fa-circle-arrow-up"></i>
                </div>

                <!--  Traffic Recv  -->
                <div class="traffic recv" v-bind:class="{ active: connection.recv }">
                    <i class="fa-solid fa-circle-arrow-down"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="stylus">
.app-control
    width:  100vw
    height: 100vh
    min-width: 900px
    min-height: 600px
    overflow: hidden
    margin: 0
    padding: 0
    display: flex
    flex-direction: column
    justify-items: center
    align-items: center
    .head
        background-color: var(--color-std-bg-1)
        color: var(--color-std-fg-1)
        padding: 10px 40px
        width:  calc(100% - 2 * 40px)
        height: 20px
        font-weight: 200
        font-size: 20px
        line-height: 20px
        position: relative
        b
            font-weight: 700
        .logo
            position: relative
            top: 2px
            height: 20px
            margin-right: 10px
    .body
        flex-grow: 1
        background-color: var(--color-std-bg-0)
        color: var(--color-std-fg-5)
        padding: 10px 10px
        width:  calc(100% - 2 * 10px)
        height: calc(100% - 2 * 10px)
        overflow: hidden
    .foot
        background-color: var(--color-std-bg-1)
        color: var(--color-std-fg-1)
        padding: 13px 40px
        width:  calc(100% - 2 * 40px)
        height: 14px
        font-weight: 200
        font-size: 14px
        line-height: 14px
        display: flex
        flex-direction: row
        justify-items: center
        align-items: center
        &.info
            font-weight: normal
            background-color: var(--color-std-bg-5)
            color: var(--color-std-fg-5)
        &.warning
            font-weight: bold
            background-color: var(--color-acc-bg-3)
            color: var(--color-acc-fg-5)
        &.error
            font-weight: bold
            background-color: var(--color-sig-bg-3)
            color: var(--color-sig-fg-5)
        .status
            flex-grow: 1
        .connection
            border: 1px solid var(--color-std-bg-3)
            background-color: var(--color-std-bg-2)
            border-radius: 4px
            padding: 4px 8px 4px 8px
            display: flex
            flex-direction: row
            justify-items: center
            align-items: center
            .online
                margin-right: 8px
                &.yes
                    color: var(--color-acc-fg-1)
                &.no
                    color: var(--color-sig-fg-1)
            .traffic
                &.send
                    margin-right: 4px
                    color: var(--color-std-fg-1)
                    &.active
                        color: var(--color-sig-fg-1)
                &.recv
                    color: var(--color-std-fg-1)
                    &.active
                        color: var(--color-acc-fg-1)
    .tabs-component
        height: 100%
        display: flex
        flex-direction: column
        justify-items: flex-start
        align-items: flex-start
    .tabs-component-panels
        flex-grow: 1
        display: flex
        flex-direction: column
        justify-items: flex-start
        align-items: flex-start
    .tabs-component-panel
        flex-grow: 1
        display: flex
        flex-direction: column
        justify-items: flex-start
        align-items: flex-start
        width: 100%
        outline: none
    .tabs-component-tab-a
        padding: 2px 4px 2px 4px
        font-size: 11pt
    .desc
        font-weight: 200
        color: var(--color-std-fg-3)
        margin-bottom: 20px
        b
            font-weight: normal
        .control-disabled
            border: 1px solid var(--color-std-fg-1)
            border-radius: 4px
            padding: 4px 8px 4px 8px
            margin-top: 10px
            color: var(--color-sig-fg-3)
            font-weight: 500
            b
                font-weight: bold
    .control
        position: relative
        display: grid
        grid-template-columns: auto auto auto 7vw auto auto
        grid-template-rows: auto
        justify-content: center
        align-items: start
        gap: 10px 10px
        .label1,
        .label2,
        .label3
            white-space: nowrap
        .label1
            color: var(--color-acc-fg-5)
            width: 80px
        .label2
            width: 110px
        .label3
            font-weight: 200
            width: 80px
        .value
            justify-self: end
            input
                width: 60px
                font-size: 12pt
                outline: none
                border-radius: 4px
                border: 0
                background-color: var(--color-acc-bg-3)
                color: var(--color-acc-fg-4)
                padding: 4px 8px 4px 8px
                text-align: right
                &:focus
                    background-color: var(--color-acc-bg-4)
                    color: var(--color-acc-fg-5)
            .fixed
                width: 60px
                font-size: 12pt
                font-weight: normal
                outline: none
                border-radius: 4px
                border: 0
                background-color: var(--color-std-bg-3)
                color: var(--color-std-fg-3)
                padding: 2px 8px 2px 8px
                text-align: center
        .button
            background-color: var(--color-std-bg-5)
            color: var(--color-std-fg-5)
            border-radius: 4px
            padding: 4px 8px 4px 8px
            min-height: 20px
            text-align: center
            font-size: 10pt
            font-weight: 200
            cursor: pointer
            &:hover
                background-color: var(--color-acc-bg-4)
                color: var(--color-acc-fg-5)
        input.text
            background-color: var(--color-acc-bg-3)
            color: var(--color-acc-fg-5)
            border: 0
            border-radius: 4px
            padding: 6px 12px 6px 12px
            outline: none
            font-size: 12pt
            width: calc(420px - 2 * 12px)
            &:focus
                background-color: var(--color-acc-bg-4)
                color: var(--color-acc-fg-5)
            &:hover
                background-color: var(--color-acc-bg-5)
                color: var(--color-acc-fg-5)
        .input.apitype
            display: flex
            flex-direction: row
            justify-content: center
            align-items: center
            .button
                flex-grow: 1
                background-color: var(--color-std-bg-2)
                color: var(--color-std-fg-3)
                border-radius: 4px
                padding: 4px 8px 4px 8px
                min-height: 20px
                text-align: center
                font-size: 10pt
                font-weight: normal
                cursor: pointer
                &.selected
                    background-color: var(--color-acc-bg-3)
                    color: var(--color-acc-fg-3)
                &:hover
                    background-color: var(--color-acc-bg-5)
                    color: var(--color-acc-fg-5)
            .button:first-child
                margin-right: 5px
        .input.attachment
            .attachment-action
                display: flex
                flex-direction: row
                justify-content: center
                align-items: center
                .button
                    flex-grow: 1
                    background-color: var(--color-std-bg-5)
                    color: var(--color-std-fg-5)
                    border-radius: 4px
                    padding: 4px 8px 4px 8px
                    min-height: 20px
                    text-align: center
                    font-size: 10pt
                    font-weight: 200
                    cursor: pointer
                    &:hover
                        background-color: var(--color-acc-bg-5)
                        color: var(--color-acc-fg-5)
                .button:first-child
                    margin-right: 5px
                .attachment-input
                    display: none
            .attachment-files
                margin-top: 8px
                border-radius: 4px
                display: flex
                flex-direction: column
                justify-content: flex-start
                align-items: flex-start
                padding: 2px 8px 2px 8px
                background-color: var(--color-std-bg-3)
                color: var(--color-std-fg-3)
                .attachment-file
                    width: 100%
                    font-size: 75%
        textarea
            background-color: var(--color-acc-bg-3)
            color: var(--color-acc-fg-5)
            border: 0
            border-radius: 4px
            padding: 6px 12px 6px 12px
            outline: none
            font-size: 12pt
            width: calc(420px - 2 * 12px)
            resize: none
            &.prompt
                font-size: 11pt
                font-weight: normal
        &.disabled
            opacity: 0.5
        .control-overlay
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
            display: flex
            flex-direction: row
            justify-content: center
            align-items: center
            z-index: 1000
    .render
        .preview-control
            margin-top: 20px
            display: flex
            flex-direction: row
            justify-items: flex-start
            align-items: center
            .action
                display: grid
                grid-template-columns: 70px 70px
                grid-template-rows: 40px
                justify-items: center
                align-items: center
                gap: 10px 10px
            .button
                background-color: var(--color-std-bg-5)
                color: var(--color-std-fg-3)
                border-radius: 4px
                padding: 2px 8px 2px 8px
                text-align: center
                font-size: 12pt
                line-height: 40px
                width: calc(100% - 2 * 8px)
                height: calc(100% - 2 * 2px)
                cursor: pointer
                &.selected
                    background-color: var(--color-acc-bg-3)
                    color: var(--color-acc-fg-3)
                &:hover
                    background-color: var(--color-acc-bg-5)
                    color: var(--color-acc-fg-5)
        .preview-url
            background-color: var(--color-acc-bg-3)
            color: var(--color-acc-fg-5)
            border-radius: 4px
            padding: 8px 16px 8px 16px
            font-size: 12pt
            width: auto
            height: auto
    .control-pane
        outline: none
        width:  100%
        height: 100%
        display: flex
        flex-direction: row
        .left
            color: var(--color-std-fg-4)
            border-radius: 4px
            width: 400px
            max-width: 400px
            min-width: 400px
            display: flex
            flex-direction: column
            justify-content: flex-start
            align-items: flex-start
            .actions
                display: flex
                flex-direction: row
                width: 100%
                *
                    flex-grow: 1
            .actions:first-child
                .button
                    padding: 0 8px 2px 8px !important
                    margin-top: 0 !important
        .middle
            width: 30px
            min-width: 30px
            max-width: 30px
            display: flex
            flex-direction: column
            justify-content: center
            align-items: center
            .upper
                flex-grow: 1
                height: 48%
                width: 100%
                position: relative
                .flow-right
                    position: absolute
                    top: 80px
                    left: 0
                    width: 80%
                    fill: var(--color-acc-bg-3)
                    margin-right: 5px
                    &.active
                        fill: var(--color-sig-bg-3)
            .lower
                flex-grow: 1
                height: 52%
                width: 100%
                position: relative
                .flow-left
                    position: absolute
                    bottom: 140px
                    right: -1px
                    width: 80%
                    fill: var(--color-std-bg-4)
                    transform: rotate(180deg)
                    transform-origin: center center
                    margin-left: 5px
        .right
            flex-grow: 1
            flex-shrink: 1
            flex-basis: 100%
            padding: 10px
            background-color: var(--color-std-bg-4)
            color: var(--color-std-fg-4)
            border-radius: 4px
            position: relative
            overflow: hidden
            height: calc(100vh - 141px - 40px)
        .button
            background-color: var(--color-std-bg-5)
            color: var(--color-std-fg-4)
            border-radius: 4px
            padding: 2px 0 2px 0
            min-height: 20px
            text-align: center
            font-size: 12pt
            font-weight: bold
            cursor: pointer
            height: 30px
            line-height: 30px
            margin-top: 5px
            margin-right: 5px
            width: 50%
            &:last-child
                margin-right: 0
            &:hover
                background-color: var(--color-acc-bg-4)
                color: var(--color-acc-fg-5)
            &.disabled
                background-color: var(--color-std-bg-1)
                color: var(--color-std-fg-2)
            &.disabled:hover
                background-color: var(--color-std-bg-1)
                color: var(--color-std-fg-2)
                cursor: default
            &.empty
                background-color: var(--color-std-bg-3)
                color: var(--color-std-fg-1)
            &.empty:hover
                background-color: var(--color-acc-bg-4)
                color: var(--color-acc-fg-1)
            &.active
                background-color: var(--color-sig-bg-3)
                color: var(--color-sig-fg-2)
            &.active:hover
                background-color: var(--color-sig-bg-3)
                color: var(--color-sig-fg-2)
            &.recording
                background-color: var(--color-sig-bg-3)
                color: var(--color-sig-fg-3)
                &:hover
                    background-color: var(--color-sig-bg-5)
                    color: var(--color-sig-fg-5)
            &.speaking
                background-color: var(--color-sig-bg-3)
                color: var(--color-sig-fg-3)
                &:hover
                    background-color: var(--color-sig-bg-5)
                    color: var(--color-sig-fg-5)
                .toggle-on
                    background-color: var(--color-sig-bg-1) !important
            .toggle-autoinject,
            .toggle-autoextract,
            .toggle-autospeak
                display: inline-block
                position: relative
                top: -3px
                margin-right: 10px
        .label
            background-color: var(--color-acc-bg-2)
            color: var(--color-acc-fg-5)
            padding: 2px 8px 2px 8px
            margin-top: 10px
            min-height: 20px
            text-align: center
            border-top-left-radius: 4px
            border-top-right-radius: 4px
        .label:first-child
            margin-top: 0
        .label.during-recording
            background-color: var(--color-sig-bg-2)
            color: var(--color-sig-fg-5)
        .studio-text
            flex-grow: 1
            flex-shrink: 1
            flex-basis: 50%
            overflow: hidden
            width: 100%
            textarea
                background-color: var(--color-acc-bg-3)
                color: var(--color-acc-fg-5)
                border: 0
                border-top-right-radius: 4px
                border-bottom-left-radius: 4px
                border-bottom-right-radius: 4px
                padding: 6px 12px 6px 12px
                margin: 0
                outline: none
                font-weight: normal
                font-size: 12pt
                width: calc(100% - 2 * 12px)
                height: calc(100% - 2 * 6px)
                resize: none
                &:disabled
                    background-color: var(--color-acc-bg-1)
                    color: var(--color-acc-fg-3)
            .studio-text-during-recording
                background-color: var(--color-sig-bg-3)
                color: var(--color-sig-fg-5)
                border: 0
                border-bottom-left-radius: 4px
                border-bottom-right-radius: 4px
                padding: 6px 12px 6px 12px
                margin: 0
                outline: none
                font-weight: normal
                font-size: 12pt
                width: calc(100% - 2 * 12px)
                height: calc(100% - 2 * 6px)
        .ai-text
            flex-grow: 1
            flex-shrink: 1
            flex-basis: 50%
            overflow: hidden
            width: 100%
            textarea
                background-color: var(--color-acc-bg-3)
                color: var(--color-acc-fg-5)
                border: 0
                border-top-right-radius: 4px
                border-bottom-left-radius: 4px
                border-bottom-right-radius: 4px
                padding: 6px 12px 6px 12px
                margin: 0
                outline: none
                font-weight: normal
                font-size: 12pt
                width: calc(100% - 2 * 12px)
                height: calc(100% - 2 * 6px)
                resize: none
                &:disabled
                    background-color: var(--color-acc-bg-1)
                    color: var(--color-acc-fg-3)
        .text2text-history
            .text2text-entry
                display: flex
                flex-direction: row
                justify-content: center
                align-items: start
                padding-top: 4px
                padding-bottom: 4px
                padding-left: 10px
                padding-right: 10px
                margin-bottom: 4px
                width: calc(100% - 20px)
                border-radius: 4px
                user-select: text
            .text2text-entry-ai
                background-color: var(--color-std-bg-2)
                color: var(--color-acc-fg-4)
            .text2text-entry-studio
                background-color: var(--color-std-bg-3)
                color: var(--color-std-fg-5)
            .text2text-entry-persona
                width:     70px
                max-width: 70px
                min-width: 70px
                font-weight: bold
            .text2text-entry-message
                flex-grow: 1
            .text2text-entry.text2text-entry-ai:last-child
                color: var(--color-sig-fg-3)
        .icon
            display: inline-block
            padding-right: 8px
            width: 15px
            .spinner-rings
                position: relative
                left: -7px
                top: -2px
            .spinner-bars
                position: relative
                left: -2px
                top: -1px
        .studio-meter
            position: relative
            top: 3px
            width:  50px
            height: 16px
            margin-right: 10px
            background-color: #222
            border-radius: 4px
        .studio-meter-closed
            display: inline-block
            position: relative
            top: 3px
            width:  50px
            height: 16px
            margin-right: 10px
            background-color: var(--color-std-bg-2)
            border-radius: 4px
    .input
        width: 420px
    .slider
        width: 420px
    .multiselect
        width: 420px
    .radios
        display: flex
        flex-direction: row
        justify-items: center
        align-items: center
        .button
            margin-right: 4px
            &.selected
                background-color: var(--color-acc-bg-3)
                color: var(--color-acc-fg-5)
            &:hover
                background-color: var(--color-acc-bg-5)
                color: var(--color-acc-fg-5)
</style>

<script setup lang="ts">
// @ts-ignore
import pkg                 from "../../package.json"
import { defineComponent } from "vue"
import { EventEmitter }    from "events"
import clone               from "clone"
import RecWebSocket        from "@opensumi/reconnecting-websocket"
import Ducky               from "ducky"
import Slider              from "@vueform/slider"
import Toggle              from "@vueform/toggle"
import Multiselect         from "@vueform/multiselect"
import axios               from "axios"
import moment              from "moment"
import PerfectScrollbar    from "perfect-scrollbar"
import { Tabs, Tab }       from "vue3-tabs-component"
import { VueSpinnerGrid, VueSpinnerBars, VueSpinnerRings } from "vue3-spinners"
import Mousetrap           from "mousetrap"
import Speech2Text, { Speech2TextChunk } from "./app-sv-speech2text"
import Text2Text, { Text2TextChunk, Text2TextAttachment } from "./app-sv-text2text"
import TextExtract         from "./app-sv-textextract"
import {
    StateType, StateTypePartial,
    StateSchema, StateSchemaPartial,
    StateDefault,
    StatePaths,
    StateUtil
} from "../common/app-common-state"
import {
    CommandType,
    CommandSchema
} from "../common/app-common-command"
import svgShapeFlow from "../../res/app-shape-flow.svg?raw"
</script>

<script lang="ts">
let statusTimer: ReturnType<typeof setTimeout> | null = null
let speech2text: Speech2Text | null = null
let text2text: Text2Text | null = null
type Text2TextLogEntry = { persona: string, message: string, final: boolean }
const commandBus = new EventEmitter()
let ws: RecWebSocket | null = null
let studioAutoInjectTimer: ReturnType<typeof setInterval> | undefined
export default defineComponent({
    name: "app-control",
    components: {
        "tabs":          Tabs,
        "tab":           Tab,
        "spinner-grid":  VueSpinnerGrid,
        "spinner-bars":  VueSpinnerBars,
        "spinner-rings": VueSpinnerRings,
        "slider":        Slider,
        "toggle":        Toggle,
        "multiselect":   Multiselect
    },
    props: {
        selectTab0: { type: String, default: "control" },
        selectTab1: { type: String, default: "" },
        serviceUrl: { type: String, default: "" },
        wsUrl:      { type: String, default: "" }
    },
    data: () => ({
        formatSliderValue: (v: number) => v.toFixed(2),
        ps: null as PerfectScrollbar | null,
        tab0: "",
        tab1: "",
        state:        StateDefault,
        stateDefault: clone(StateDefault),
        watchState: true,
        recording: false,
        recordingDisabled: false,
        speaking: false,
        studioMessage: "",
        studioMessageFinal: true,
        studioAutoInject: false,
        studioSlot: 0,
        aiMessage: "",
        aiSlot: 0,
        aiAutoExtract: false,
        aiAutoSpeak: false,
        text2textLog: [] as Array<Text2TextLogEntry>,
        attachmentCount: 0,
        attachmentFilenames: [] as string[],
        status: {
            kind: "",
            msg:  ""
        },
        connection: {
            online: false,
            send:   false,
            recv:   false
        },
        pkg,
        engine: {
            speech2text: 0,
            text2text:   0,
            text2speech: 0
        }
    }),
    computed: {
        openaiMimeTypes () {
            if (this.state.text2text.openaiApiType === "assistant")
                return ".txt,  text/plain, " +
                    ".md,   text/markdown, " +
                    ".html, text/html, " +
                    ".json, application/json, " +
                    ".pdf,  application/pdf, " +
                    ".docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, " +
                    ".pptx, application/vnd.openxmlformats-officedocument.presentationml.presentation, " +
                    ".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            else
                return TextExtract.supportedHtmlAccept
        }
    },
    created () {
        this.log("INFO", `starting ${pkg.name} ${pkg.version} (${pkg["x-date"]}) <${pkg.homepage}> client (CONTROL mode)`)
    },
    async mounted () {
        /*  force particular level-1 (and optionally level-2) tab to be selected  */
        (this.$refs.tabs as any).selectTab(`#${this.selectTab0}`)
        if (this.$refs[this.selectTab0] !== undefined)
            (this.$refs[this.selectTab0] as any).selectTab(`#${this.selectTab1}`)

        /*  establish server connection  */
        this.log("INFO", "establishing WebSocket connection to server")
        ws = new RecWebSocket(this.wsUrl + "/control", [], {
            reconnectionDelayGrowFactor: 1.3,
            maxReconnectionDelay:        4000,
            minReconnectionDelay:        1000,
            connectionTimeout:           4000,
            minUptime:                   5000
        })
        ws.addEventListener("open", (ev) => {
            this.connection.online = true
        })
        ws.addEventListener("close", (ev) => {
            this.connection.online = false
            this.raiseStatus("error", "WebSocket connection failed/closed", 2000)
        })

        /*  receive server messages  */
        ws.addEventListener("message", (ev: MessageEvent) => {
            this.traffic({ recv: true }).done()
            if (typeof ev.data !== "string") {
                this.raiseStatus("warning", "invalid WebSocket message received", 1000)
                return
            }
            const data: any = JSON.parse(ev.data)
            if (!(typeof data === "object" && typeof data.cmd === "string" && data.arg !== undefined)) {
                this.raiseStatus("warning", "invalid WebSocket message received", 1000)
                return
            }
            if (data.cmd === "STATE") {
                const state = data.arg.state as StateTypePartial
                const errors = [] as Array<string>
                if (!Ducky.validate(state, StateSchemaPartial, errors))
                    throw new Error(`invalid schema of loaded state: ${errors.join(", ")}`)
                this.importState(state)
            }
            else if (data.cmd === "COMMAND") {
                const command = data.arg.command as CommandType
                const errors = [] as Array<string>
                if (!Ducky.validate(command, CommandSchema, errors)) {
                    this.log("WARNING", `invalid schema of command: ${errors.join(", ")}`)
                    return
                }
                commandBus.emit(command.cmd, ...command.args)
            }
        })

        /*  pass-through log entries of peer "render" client  */
        commandBus.on("render:log", (level, msg) => {
            this.log(level, `[render]: ${msg}`)
        })

        /*  initially load state  */
        await this.loadState()

        /*  initially load attachment information  */
        await this.openaiAttachmentCount()
        await this.openaiAttachmentFilenames()

        /*  react on all subsequent state changes  */
        let timer: ReturnType<typeof setTimeout> | null = null
        let queue = [] as string[]
        for (const path of StatePaths) {
            this.$watch(`state.${path}`, () => {
                if (!this.watchState)
                    return
                queue.push(path)
                if (timer !== null)
                    return
                timer = setTimeout(async () => {
                    timer = null
                    const paths = queue
                    queue = []
                    await this.patchState(paths)
                }, 100)
            })
        }

        /*  persist message slots  */
        this.$watch("studioMessage", () => {
            if (this.studioSlot === 0)
                return
            let key:
                "studio1"  | "studio2"  | "studio3"  | "studio4"  |
                "studio5"  | "studio6"  | "studio7"  | "studio8"  |
                "studio9"  | "studio10" | "studio11" | "studio12" |
                "studio13" | "studio14" | "studio15" | "studio16"
            if      (this.studioSlot === 1)  key = "studio1"
            else if (this.studioSlot === 2)  key = "studio2"
            else if (this.studioSlot === 3)  key = "studio3"
            else if (this.studioSlot === 4)  key = "studio4"
            else if (this.studioSlot === 5)  key = "studio5"
            else if (this.studioSlot === 6)  key = "studio6"
            else if (this.studioSlot === 7)  key = "studio7"
            else if (this.studioSlot === 8)  key = "studio8"
            else if (this.studioSlot === 9)  key = "studio9"
            else if (this.studioSlot === 10) key = "studio10"
            else if (this.studioSlot === 11) key = "studio11"
            else if (this.studioSlot === 12) key = "studio12"
            else if (this.studioSlot === 13) key = "studio13"
            else if (this.studioSlot === 14) key = "studio14"
            else if (this.studioSlot === 15) key = "studio15"
            else if (this.studioSlot === 16) key = "studio16"
            else
                throw new Error("invalid index")
            this.state.slots[key] = this.studioMessage
            this.patchState([ `slots.${key}` ])
        })
        this.$watch("aiMessage", () => {
            if (this.aiSlot === 0)
                return
            let key:
                "ai1"  | "ai2"  | "ai3"  | "ai4"  |
                "ai5"  | "ai6"  | "ai7"  | "ai8"  |
                "ai9"  | "ai10" | "ai11" | "ai12" |
                "ai13" | "ai14" | "ai15" | "ai16"
            if      (this.aiSlot === 1)  key = "ai1"
            else if (this.aiSlot === 2)  key = "ai2"
            else if (this.aiSlot === 3)  key = "ai3"
            else if (this.aiSlot === 4)  key = "ai4"
            else if (this.aiSlot === 5)  key = "ai5"
            else if (this.aiSlot === 6)  key = "ai6"
            else if (this.aiSlot === 7)  key = "ai7"
            else if (this.aiSlot === 8)  key = "ai8"
            else if (this.aiSlot === 9)  key = "ai9"
            else if (this.aiSlot === 10) key = "ai10"
            else if (this.aiSlot === 11) key = "ai11"
            else if (this.aiSlot === 12) key = "ai12"
            else if (this.aiSlot === 13) key = "ai13"
            else if (this.aiSlot === 14) key = "ai14"
            else if (this.aiSlot === 15) key = "ai15"
            else if (this.aiSlot === 16) key = "ai16"
            else
                throw new Error("invalid index")
            this.state.slots[key] = this.aiMessage
            this.patchState([ `slots.${key}` ])
        })

        /*  activate text-to-text-history scrolling  */
        const container = this.$refs.right as HTMLElement
        this.ps = new PerfectScrollbar(container, {
            suppressScrollX: true,
            scrollXMarginOffset: 100
        })
        this.$watch("text2textLog", () => {
            this.ps!.update()
            setTimeout(() => {
                container.scrollTo({ left: 0, top: container.scrollHeight })
            }, 50)
        }, { deep: true })


        /*  control Speech-to-Text engine (LOCAL)  */
        this.log("INFO", "preparing S2T engine (LOCAL)")
        let s2tStudioBuffer = [ "" ]
        const s2tEngineOpen = async () => {
            /*  (re)establish engine  */
            this.log("INFO", "S2T: start engine")
            speech2text = new Speech2Text({
                device:   this.state.speech2text.microphoneDevice,
                apiToken: this.state.speech2text.deepgramApiToken,
                model:    this.state.speech2text.deepgramModel,
                version:  this.state.speech2text.deepgramVersion,
                language: this.state.speech2text.deepgramLanguage,
                keywords: this.state.speech2text.deepgramKeywords
            })

            /*  attach to engine events  */
            speech2text.on("log", (level: string, msg: string) => {
                this.log(level, `S2T: ${msg}`)
            })
            speech2text.on("traffic", (flags: { send?: boolean, recv?: boolean }) => {
                this.traffic(flags).done()
            })
            speech2text.on("open", () => {
                if (this.engine.speech2text === 1)
                    this.engine.speech2text = 2
            })
            speech2text.on("close", () => {
                if (this.engine.speech2text === 2) {
                    this.log("INFO", "S2T: unexpected engine stop -- re-starting engine")
                    this.engine.speech2text = 1
                }
            })
            s2tStudioBuffer = [ "" ]
            speech2text.on("text", (chunk: Speech2TextChunk) => {
                s2tStudioBuffer[s2tStudioBuffer.length - 1] = chunk.text
                if (chunk.final) {
                    s2tStudioBuffer.push("")
                    this.studioMessageFinal = true
                }
                else
                    this.studioMessageFinal = false
                this.studioMessage = s2tStudioBuffer.join(" ")
            })

            /*  start engine  */
            await speech2text.open().catch((err) => {
                this.engine.speech2text = 0
                this.log("ERROR", `S2T engine failed: ${err}`)
                this.raiseStatus("error", `S2T engine failed: ${err}`, 2000)
            })

            /*  attach engine audio meter to DOM  */
            speech2text.audioMeterApply(this.$refs.studioMeter as HTMLCanvasElement)
        }
        const s2tEngineClose = async () => {
            /*  deattach engine audio meter from DOM  */
            speech2text!.audioMeterUnapply(this.$refs.studioMeter as HTMLCanvasElement)

            /*  stop engine  */
            this.log("INFO", "S2T: stop engine")
            await speech2text!.close()
            speech2text = null
        }
        this.$watch("engine.speech2text", async () => {
            if (this.engine.speech2text === 1)
                s2tEngineOpen()
            else if (this.engine.speech2text === 0)
                s2tEngineClose()
        })
        this.$watch("recording", async () => {
            if (speech2text === null)
                return
            if (this.recording) {
                this.log("INFO", "S2T: start recording")
                speech2text.setActive(true)
                s2tStudioBuffer = [ "" ]
            }
            else {
                this.log("INFO", "S2T: stop recording")
                speech2text.setActive(false)
                if (this.studioAutoInject) {
                    const iterationDelay = 10
                    let iterationCount = (10 * 1000) / iterationDelay
                    if (studioAutoInjectTimer !== undefined) {
                        clearInterval(studioAutoInjectTimer)
                        studioAutoInjectTimer = undefined
                        await new Promise((resolve) => setTimeout(resolve, iterationDelay))
                    }
                    const poll = () => {
                        if (this.studioMessage !== "" && this.studioMessageFinal) {
                            clearInterval(studioAutoInjectTimer)
                            studioAutoInjectTimer = undefined
                            this.studioInject()
                        }
                        else if (iterationCount-- <= 0) {
                            clearInterval(studioAutoInjectTimer)
                            studioAutoInjectTimer = undefined
                        }
                    }
                    studioAutoInjectTimer = setInterval(poll, iterationDelay)
                }
            }
        })

        /*  control Text-to-Text engine (LOCAL)  */
        this.log("INFO", "preparing T2T engine (LOCAL)")
        const t2tEngineOpen = async () => {
            /*  (re)establish engine  */
            this.log("INFO", "T2T: start engine")
            const attachments = [] as Text2TextAttachment[]
            for (let i = 0; i < this.attachmentCount; i++)
                attachments.push(await this.openaiAttachmentFetch(i))
            text2text = new Text2Text({
                apiToken:     this.state.text2text.openaiApiToken,
                model:        this.state.text2text.openaiModel,
                apiType:      this.state.text2text.openaiApiType,
                attachments,
                prompt:       this.state.text2text.openaiPrompt,
                temperature:  this.state.text2text.openaiTemperature,
                seed:         this.state.text2text.openaiSeed,
                maxTokens:    this.state.text2text.openaiMaxTokens
            })

            /*  attach to engine events  */
            text2text.on("log", (level: string, msg: string) => {
                this.log(level, `T2T: ${msg}`)
            })
            text2text.on("traffic", (flags: { send?: boolean, recv?: boolean }) => {
                this.traffic(flags).done()
            })
            text2text.on("text", (chunk: Text2TextChunk) => {
                const text2textLog = this.text2textLog as Array<Text2TextLogEntry>
                if (this.text2textLog.length === 0
                    || text2textLog[text2textLog.length - 1].persona === "Studio"
                    || text2textLog[text2textLog.length - 1].final)
                    text2textLog.push({ persona: "AI", message: "", final: false })
                const entry = text2textLog[text2textLog.length - 1]
                entry.message = chunk.text
                entry.final   = chunk.final
                if (entry.final) {
                    if (this.aiAutoExtract)
                        this.aiExtract(true)
                    if (this.aiAutoSpeak)
                        this.aiSpeak(true)
                }
            })
            text2text.on("open", () => {
                if (this.engine.text2text === 1)
                    this.engine.text2text = 2
            })
            text2text.on("close", () => {
                if (this.engine.text2text === 2) {
                    this.log("INFO", "T2T: unexpected engine stop -- re-starting engine")
                    this.engine.text2text = 1
                }
                else
                    this.text2textLog = [] as Array<Text2TextLogEntry>
            })

            /*  start engine  */
            await text2text.open().catch((err) => {
                this.engine.text2text = 0
                this.log("ERROR", `T2T engine failed: ${err}`)
                this.raiseStatus("error", `T2T engine failed: ${err}`, 2000)
            })
        }
        const t2tEngineClose = async () => {
            /*  stop engine  */
            this.log("INFO", "T2T: stop engine")
            await text2text!.close()
            text2text = null
        }
        this.$watch("engine.text2text", async () => {
            if (this.engine.text2text === 1)
                t2tEngineOpen()
            else if (this.engine.text2text === 0)
                t2tEngineClose()
        })
        this.$watch("state.text2text.openaiApiType", (newVal: string, oldVal: string) => {
            if (newVal !== oldVal)
                this.openaiAttachmentClear()
        })

        /*  control Text-to-Speech engine (REMOTE)  */
        this.log("INFO", "preparing T2S engine (REMOTE)")
        const t2sEngineOpen = async () => {
            this.log("INFO", "T2S: start engine")
            this.engine.text2speech = 1
            this.sendCommand("t2s:open")
        }
        const t2sEngineClose = async () => {
            this.log("INFO", "T2S: stop engine")
            this.sendCommand("t2s:close")
        }
        this.$watch("engine.text2speech", async () => {
            if (this.engine.text2speech === 1)
                t2sEngineOpen()
            else if (this.engine.text2speech === 0)
                t2sEngineClose()
        })
        commandBus.on("t2s:opened", () => {
            this.log("INFO", "T2S: engine started")
            this.engine.text2speech = 2
        })
        commandBus.on("t2s:closed", () => {
            this.engine.text2speech = 0
        })
        commandBus.on("t2s:speak:start", () => {
            this.speaking = true
        })
        commandBus.on("t2s:speak:stop", () => {
            this.speaking = false
            this.aiSlot = 0
            this.aiMessage = ""
        })
        commandBus.on("t2s:traffic", (flags: { send?: boolean, recv?: boolean }) => {
            this.traffic(flags).done()
        })

        /*  support UI control via keystrokes (just maps onto commands below)  */
        Mousetrap.bind("ctrl+1", () => { commandBus.emit("ui:s2t-press") })
        Mousetrap.bind("ctrl+2", () => { commandBus.emit("ui:t2t-press") })
        Mousetrap.bind("ctrl+3", () => { commandBus.emit("ui:t2s-press") })
        Mousetrap.bind("ctrl+4", () => { commandBus.emit("ui:record-press") })
        Mousetrap.bind("ctrl+5", () => { commandBus.emit("ui:inject-press") })
        Mousetrap.bind("ctrl+6", () => { commandBus.emit("ui:extract-press") })
        Mousetrap.bind("ctrl+7", () => { commandBus.emit("ui:speak-press") })
        Mousetrap.bind("ctrl+8", () => { commandBus.emit("ui:auto-inject-press") })
        Mousetrap.bind("ctrl+9", () => { commandBus.emit("ui:auto-extract-press") })
        Mousetrap.bind("ctrl+0", () => { commandBus.emit("ui:auto-speak-press") })
        Mousetrap.bind("f1", () => {
            if (!this.engine.speech2text) commandBus.emit("ui:s2t-press")
            if (!this.engine.text2text)   commandBus.emit("ui:t2t-press")
            if (!this.engine.text2speech) commandBus.emit("ui:t2s-press")
            if (!this.studioAutoInject)   commandBus.emit("ui:auto-inject-press")
            if (!this.aiAutoExtract)      commandBus.emit("ui:auto-extract-press")
            if (!this.aiAutoSpeak)        commandBus.emit("ui:auto-speak-press")
        })
        Mousetrap.bind("f2", () => {
            if (this.engine.speech2text)  commandBus.emit("ui:s2t-press")
            if (this.engine.text2text)    commandBus.emit("ui:t2t-press")
            if (this.engine.text2speech)  commandBus.emit("ui:t2s-press")
            if (this.studioAutoInject)    commandBus.emit("ui:auto-inject-press")
            if (this.aiAutoExtract)       commandBus.emit("ui:auto-extract-press")
            if (this.aiAutoSpeak)         commandBus.emit("ui:auto-speak-press")
        })
        Mousetrap.bind("f3", () => {
            commandBus.emit("ui:record-press")
        })

        /*  support UI control via command (usually coming from server)  */
        commandBus.on("ui:s2t-press",          () => { this.engineToggle("speech2text") })
        commandBus.on("ui:t2t-press",          () => { this.engineToggle("text2text") })
        commandBus.on("ui:t2s-press",          () => { this.engineToggle("text2speech") })
        commandBus.on("ui:record-press",       () => { this.toggleRecording() })
        commandBus.on("ui:inject-press",       () => { this.studioInject() })
        commandBus.on("ui:extract-press",      () => { this.aiExtract() })
        commandBus.on("ui:speak-press",        () => { this.aiSpeak() })
        commandBus.on("ui:auto-inject-press",  () => { this.studioAutoInject = !this.studioAutoInject })
        commandBus.on("ui:auto-extract-press", () => { this.aiAutoExtract    = !this.aiAutoExtract })
        commandBus.on("ui:auto-speak-press",   () => { this.aiAutoSpeak      = !this.aiAutoSpeak })
    },
    methods: {
        /*  log to the console  */
        log (level: string, msg: string) {
            const timestamp = moment().format("YYYY-MM-DD hh:mm:ss.SSS")
            const levelStr = `[${level}]:     `.substring(0, 10)
            console.log(`${timestamp} ${levelStr} ${msg}`)
        },

        /*  raise a temporaily visible status message in the footer  */
        raiseStatus (kind: string, msg: string, duration = 4000) {
            this.status.kind = kind
            this.status.msg  = msg
            if (statusTimer !== null)
                clearTimeout(statusTimer)
            statusTimer = setTimeout(() => {
                this.status.kind = ""
                this.status.msg  = ""
                statusTimer = null
            }, duration)
        },

        /*  open preview URL in own window  */
        previewOpen () {
            window.open(`${this.serviceUrl}#/render`, "_blank")
        },

        /*  copy preview URL to clipboard  */
        previewCopy () {
            navigator.clipboard.writeText(`${this.serviceUrl}#/render`)
        },

        /*  update URL on tab changes  */
        tabChanged0 (tab: any) {
            const id = tab.tab.computedId
            this.tab0 = id
            if (this.$refs[id] !== undefined)
                this.tab1 = (this.$refs[id] as any).activeTabHash.replace(/^#/, "")
            else
                this.tab1 = ""
            this.updateURL()
        },
        tabChanged1 (tab: any) {
            const id = tab.tab.computedId
            this.tab1 = id
            this.updateURL()
        },
        updateURL () {
            if (this.tab1 !== "")
                window.location.hash = `#/control/${this.tab0}/${this.tab1}`
            else
                window.location.hash = `#/control/${this.tab0}`
        },

        /*  import a field  */
        fieldImport (txt: string, min: number, max: number) {
            txt = txt.replace(/^s+/, "").replace(/\s+$/, "")
            let n = parseFloat(txt)
            if (Number.isNaN(n))
                n = 0
            n = Math.max(Math.min(n, max), min)
            return n
        },

        /*  export a field  */
        fieldExport (n: number, digits = 2, nosign = false) {
            let txt = n.toFixed(digits)
            if (!txt.match(/^-/) && !nosign)
                txt = `+${txt}`
            return txt
        },

        /*  merge partial state into current state  */
        mergeState (state: Readonly<StateTypePartial>, paths?: Readonly<string[]>) {
            return StateUtil.copy(this.state, state, paths)
        },

        /*  import partial state into current state  */
        importState (state: Readonly<StateTypePartial>, paths?: Readonly<string[]>) {
            this.watchState = false
            const changed = this.mergeState(state, paths)
            if (changed)
                setTimeout(() => { this.watchState = true }, 50)
            else
                this.watchState = true
        },

        /*  export partial state from current state  */
        exportState (paths?: Readonly<string[]>): StateTypePartial {
            const dst = {}
            StateUtil.copy(dst, this.state, paths)
            return dst
        },

        /*  load current state  */
        async loadState () {
            const traffic = this.traffic({ recv: true })
            const state = await axios({
                method: "GET",
                url:    `${this.serviceUrl}state`
            }).then((response) => response.data).catch(() => null).finally(() => {
                traffic.done()
            })
            if (state === null)
                throw new Error("failed to load state")
            const errors = [] as Array<string>
            if (!Ducky.validate(state, StateSchema, errors))
                throw new Error(`invalid schema of loaded state: ${errors.join(", ")}`)
            this.mergeState(state as StateType)
        },

        /*  save current state  */
        async saveState () {
            const traffic = this.traffic({ send: true })
            await axios({
                method: "POST",
                url:    `${this.serviceUrl}state`,
                data:   this.state
            }).finally(() => {
                traffic.done()
            })
        },

        /*  patch current state  */
        async patchState (paths: Readonly<string[]>) {
            const state = {}
            StateUtil.copy(state, this.state, paths)
            const traffic = this.traffic({ send: true })
            await axios({
                method: "PATCH",
                url:    `${this.serviceUrl}state`,
                data:   state
            }).finally(() => {
                traffic.done()
            })
        },

        /*  inject studio text into text-to-text engine  */
        async studioInject () {
            if (this.studioMessage === "" || this.engine.text2text !== 2 || text2text === null)
                return
            this.text2textLog.push({ persona: "Studio", message: this.studioMessage, final: true })
            await text2text.send(this.studioMessage)
            this.studioSlot = 0
            this.studioMessage = ""
        },

        /*  select studio slot  */
        studioSlotSelect (n: number) {
            if (this.studioSlot === n) {
                this.studioSlot = 0
                this.studioMessage = ""
            }
            else {
                this.studioSlot = n
                let val
                if      (n === 1)  val = this.state.slots.studio1
                else if (n === 2)  val = this.state.slots.studio2
                else if (n === 3)  val = this.state.slots.studio3
                else if (n === 4)  val = this.state.slots.studio4
                else if (n === 5)  val = this.state.slots.studio5
                else if (n === 6)  val = this.state.slots.studio6
                else if (n === 7)  val = this.state.slots.studio7
                else if (n === 8)  val = this.state.slots.studio8
                else if (n === 9)  val = this.state.slots.studio9
                else if (n === 10) val = this.state.slots.studio10
                else if (n === 11) val = this.state.slots.studio11
                else if (n === 12) val = this.state.slots.studio12
                else if (n === 13) val = this.state.slots.studio13
                else if (n === 14) val = this.state.slots.studio14
                else if (n === 15) val = this.state.slots.studio15
                else if (n === 16) val = this.state.slots.studio16
                else
                    throw new Error("invalid index")
                this.studioMessage = val
            }
        },

        /*  determine whether we can extract AI text from text-to-text engine  */
        aiExtractable () {
            if (this.engine.text2text === 2 && this.text2textLog.length > 0) {
                const entry = this.text2textLog[this.text2textLog.length - 1]
                if (entry.persona === "AI")
                    return true
            }
            return false
        },

        /*  extract AI text from text-to-text engine  */
        aiExtract (auto = false) {
            if (this.engine.text2text === 2 && this.text2textLog.length > 0) {
                const entry = this.text2textLog[this.text2textLog.length - 1]
                if (entry.persona === "AI") {
                    const pronounciation = this.state.text2speech.pronounciation
                    const pronounciations = pronounciation.split(/\s*,\s*/)
                    let message = entry.message
                    for (const p of pronounciations) {
                        const m = p.match(/^\s*(.+?)\s*:\s*(.+?)\s*$/)
                        if (m !== null)
                            message = message.replaceAll(new RegExp(`\\b${m[1]}\\b`, "g"), m[2])
                    }
                    this.aiMessage = message
                }
            }
        },

        /*  start/stop AI speaking  */
        aiSpeak (auto = false) {
            if (this.engine.text2speech !== 2)
                return
            if (this.speaking) {
                this.sendCommand("t2s:interrupt")
                if (!auto)
                    return
            }
            if (this.aiMessage === "")
                return
            this.sendCommand("t2s:speak", [ { text: this.aiMessage } ])
        },

        /*  select AI slot  */
        aiSlotSelect (n: number) {
            if (this.aiSlot === n) {
                this.aiSlot = 0
                this.aiMessage = ""
            }
            else {
                this.aiSlot = n
                let val
                if      (n === 1)  val = this.state.slots.ai1
                else if (n === 2)  val = this.state.slots.ai2
                else if (n === 3)  val = this.state.slots.ai3
                else if (n === 4)  val = this.state.slots.ai4
                else if (n === 5)  val = this.state.slots.ai5
                else if (n === 6)  val = this.state.slots.ai6
                else if (n === 7)  val = this.state.slots.ai7
                else if (n === 8)  val = this.state.slots.ai8
                else if (n === 9)  val = this.state.slots.ai9
                else if (n === 10) val = this.state.slots.ai10
                else if (n === 11) val = this.state.slots.ai11
                else if (n === 12) val = this.state.slots.ai12
                else if (n === 13) val = this.state.slots.ai13
                else if (n === 14) val = this.state.slots.ai14
                else if (n === 15) val = this.state.slots.ai15
                else if (n === 16) val = this.state.slots.ai16
                else
                    throw new Error("invalid index")
                this.aiMessage = val
            }
        },

        /*  toggle recording  */
        async toggleRecording () {
            if (this.engine.speech2text !== 2)
                return
            if (this.recordingDisabled)
                return
            if (!this.recording) {
                /*  start recording  */
                this.recording = true
                this.studioMessage = ""
            }
            else {
                /*  stop recording  */
                this.recording = false
                this.recordingDisabled = true
                setTimeout(() => {
                    this.recordingDisabled = false
                }, 500)
            }
        },

        /*  toggle engine  */
        engineToggle (engine: "speech2text" | "text2text" | "text2speech") {
            if (this.engine[engine] === 2)
                this.engine[engine] = 0
            else if (this.engine[engine] === 0)
                this.engine[engine] = 1
        },

        /*  provide connection indicator flashing  */
        traffic (flags: { send?: boolean, recv?: boolean }): { done (): void } {
            /*  fetch flags onto stack  */
            const send = flags.send ?? false
            const recv = flags.recv ?? false

            /*  raise flags  */
            if (send) this.connection.send = true
            if (recv) this.connection.recv = true

            /*  later teardown flags again  */
            const doneAction = () => {
                if (send) this.connection.send = false
                if (recv) this.connection.recv = false
            }

            /*  track seen triggers  */
            let seenTimer    = false
            let seenCallback = false

            /*  provide timer tigger  */
            setTimeout(() => {
                if (seenCallback /* timer comes later */)
                    doneAction()
                seenTimer = true
            }, 250)

            /*  provide callback tigger  */
            return {
                done () {
                    if (seenTimer /* callback comes later */)
                        doneAction()
                    seenCallback = true
                }
            }
        },

        /*  send command  */
        async sendCommand (cmd: string, args = [] as any[] ) {
            if (ws === null)
                return
            const traffic = this.traffic({ send: true })
            const msg = JSON.stringify({ cmd: "COMMAND", arg: { cmd, args } })
            if (ws.readyState === RecWebSocket.OPEN)
                ws.send(msg)
            traffic.done()
        },

        /*  get attachment count  */
        async openaiAttachmentCount () {
            const traffic = this.traffic({ recv: true })
            const response = await axios({
                method:  "GET",
                url:     `${this.serviceUrl}attachment/count`
            }).finally(() => {
                traffic.done()
            })
            this.attachmentCount = parseInt(response?.data?.count) ?? 0
        },

        /*  get attachment filenames  */
        async openaiAttachmentFilenames () {
            const traffic = this.traffic({ recv: true })
            const response = await axios({
                method:  "GET",
                url:     `${this.serviceUrl}attachment/filenames`
            }).finally(() => {
                traffic.done()
            })
            this.attachmentFilenames = response?.data?.filenames ?? []
        },

        /*  attach a file  */
        async openaiAttachmentChange (ev: Event) {
            const files = (ev.target as any)!.files as FileList
            if (files.length > 0) {
                const formData = new FormData()
                let i = 0
                while (i < files.length) {
                    formData.append(`attachment-${i}`, files[i])
                    i++
                }
                const traffic = this.traffic({ send: true })
                await axios({
                    method:  "POST",
                    url:     `${this.serviceUrl}attachment`,
                    headers: { "Content-Type": "multipart/form-data" },
                    data:    formData
                }).finally(() => {
                    traffic.done()
                })
                await this.openaiAttachmentCount()
                await this.openaiAttachmentFilenames()
            }
        },

        /*  fetch a particular attachment  */
        async openaiAttachmentFetch (i: number) {
            const traffic = this.traffic({ recv: true })
            const response = await axios({
                method:       "GET",
                url:          `${this.serviceUrl}attachment/${i}`,
                responseType: "arraybuffer"
            }).finally(() => {
                traffic.done()
            })
            const data = response.data as any
            let   name = `attachment-${i}`
            const header = response.headers["content-disposition"] ?? ""
            let m
            if ((m = header.match(/filename="(.+?)"/)) !== null)
                name = m[1]
            return { name, data } as Text2TextAttachment
        },

        /*  remove all attachments  */
        async openaiAttachmentClear () {
            const traffic = this.traffic({ send: true })
            await axios({
                method:  "GET",
                url:     `${this.serviceUrl}attachment/clear`
            }).finally(() => {
                traffic.done()
            })
            this.attachmentCount = 0
            this.attachmentFilenames = []
        }
    }
})
</script>

