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
            <img class="logo" src="../../res/app-icon.svg" alt="" />
            <b>Studio AI</b> Control
        </div>

        <!--  BODY  -->
        <div class="body">
            <tabs ref="tabs" v-bind:options="{ useUrlFragment: false }" v-bind:cache-lifetime="0" class="tabs-level-1" v-on:changed="tabChanged">
                <!--  ==== SETTINGS ====  -->
                <tab id="settings" name="Settings">
                    <div class="control">
                        <div class="label1">deepgram</div>
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
                            <input class="text" v-model.lazy="state.speech2text.deepgramApiToken"/>
                        </div>

                        <div class="label1">deepgram</div>
                        <div class="label2">(model)</div>
                        <div class="label3">[id]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.speech2text.deepgramModel = stateDefault.speech2text.deepgramModel">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.speech2text.deepgramModel"/>
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
                            <input class="text" v-model.lazy="state.speech2text.deepgramLanguage"/>
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

                        <div class="label1">openai</div>
                        <div class="label2">(API)</div>
                        <div class="label3">[token]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.chat.openaiApiToken = stateDefault.chat.openaiApiToken">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.chat.openaiApiToken"/>
                        </div>

                        <div class="label1">openai</div>
                        <div class="label2">(model)</div>
                        <div class="label3">[id]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.chat.openaiModel = stateDefault.chat.openaiModel">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.chat.openaiModel"/>
                        </div>

                        <div class="label1">openai</div>
                        <div class="label2">(prompt)</div>
                        <div class="label3">[string]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.chat.openaiPrompt = stateDefault.chat.openaiPrompt">RESET</div>
                        <div class="input">
                            <textarea class="prompt" rows="5" v-model.lazy="state.chat.openaiPrompt"></textarea>
                        </div>

                        <div class="label1">openai</div>
                        <div class="label2">(temperature)</div>
                        <div class="label3">[number]:</div>
                        <div class="value">
                            <input tabindex="8" v-bind:value="fieldExport(state.chat.openaiTemperature)"
                                v-on:change="(ev) => state.chat.openaiTemperature = fieldImport((ev.target! as HTMLInputElement).value, 0.0, 2.0)"/>
                        </div>
                        <div class="button" v-on:click="state.chat.openaiTemperature = stateDefault.chat.openaiTemperature">RESET</div>
                        <div class="input">
                            <slider class="slider" v-model="state.chat.openaiTemperature"
                                v-bind:min="0.0" v-bind:max="2.0" v-bind:step="0.05"
                                show-tooltip="drag" v-bind:format="formatSliderValue" v-bind:lazy="false"
                            ></slider>
                        </div>

                        <div class="label1">openai</div>
                        <div class="label2">(seed)</div>
                        <div class="label3">[number]:</div>
                        <div class="value">
                            <input tabindex="8" v-bind:value="fieldExport(state.chat.openaiSeed)"
                                v-on:change="(ev) => state.chat.openaiSeed = fieldImport((ev.target! as HTMLInputElement).value, 0, 100)"/>
                        </div>
                        <div class="button" v-on:click="state.chat.openaiSeed = stateDefault.chat.openaiSeed">RESET</div>
                        <div class="input">
                            <slider class="slider" v-model="state.chat.openaiSeed"
                                v-bind:min="0" v-bind:max="100" v-bind:step="1"
                                show-tooltip="drag" v-bind:format="formatSliderValue" v-bind:lazy="false"
                            ></slider>
                        </div>

                        <div class="label1">openai</div>
                        <div class="label2">(max-tokens)</div>
                        <div class="label3">[number]:</div>
                        <div class="value">
                            <input tabindex="8" v-bind:value="fieldExport(state.chat.openaiMaxTokens)"
                                v-on:change="(ev) => state.chat.openaiMaxTokens = fieldImport((ev.target! as HTMLInputElement).value, 10, 1000)"/>
                        </div>
                        <div class="button" v-on:click="state.chat.openaiMaxTokens = stateDefault.chat.openaiMaxTokens">RESET</div>
                        <div class="input">
                            <slider class="slider" v-model="state.chat.openaiMaxTokens"
                                v-bind:min="10" v-bind:max="1000" v-bind:step="10"
                                show-tooltip="drag" v-bind:format="formatSliderValue" v-bind:lazy="false"
                            ></slider>
                        </div>

                        <div class="label1">heygen</div>
                        <div class="label2">(API)</div>
                        <div class="label3">[token]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.text2speech.heygenApiToken = stateDefault.text2speech.heygenApiToken">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.text2speech.heygenApiToken"/>
                        </div>

                        <div class="label1">heygen</div>
                        <div class="label2">(avatar)</div>
                        <div class="label3">[id]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.text2speech.heygenAvatarId = stateDefault.text2speech.heygenAvatarId">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.text2speech.heygenAvatarId"/>
                        </div>

                        <div class="label1">heygen</div>
                        <div class="label2">(quality)</div>
                        <div class="label3">[level]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.text2speech.heygenQuality = stateDefault.text2speech.heygenQuality">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.text2speech.heygenQuality"/>
                        </div>

                        <div class="label1">heygen</div>
                        <div class="label2">(voice)</div>
                        <div class="label3">[id]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.text2speech.heygenVoiceId = stateDefault.text2speech.heygenVoiceId">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.text2speech.heygenVoiceId"/>
                        </div>

                        <div class="label1">heygen</div>
                        <div class="label2">(rate)</div>
                        <div class="label3">[number]:</div>
                        <div class="value">
                            <input tabindex="8" v-bind:value="fieldExport(state.text2speech.heygenRate)"
                                v-on:change="(ev) => state.text2speech.heygenRate = fieldImport((ev.target! as HTMLInputElement).value, 0.50, 1.50)"/>
                        </div>
                        <div class="button" v-on:click="state.text2speech.heygenRate = stateDefault.text2speech.heygenRate">RESET</div>
                        <div class="input">
                            <slider class="slider" v-model="state.text2speech.heygenRate"
                                v-bind:min="0.50" v-bind:max="1.50" v-bind:step="0.05"
                                show-tooltip="drag" v-bind:format="formatSliderValue" v-bind:lazy="false"
                            ></slider>
                        </div>

                        <div class="label1">heygen</div>
                        <div class="label2">(emotion)</div>
                        <div class="label3">[type]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.text2speech.heygenEmotion = stateDefault.text2speech.heygenEmotion">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.text2speech.heygenEmotion"/>
                        </div>

                        <div class="label1">heygen</div>
                        <div class="label2">(speaker)</div>
                        <div class="label3">[device]:</div>
                        <div class="value">
                            <div class="fixed">*</div>
                        </div>
                        <div class="button" v-on:click="state.text2speech.speakerDevice = stateDefault.text2speech.speakerDevice">RESET</div>
                        <div class="input">
                            <input class="text" v-model.lazy="state.text2speech.speakerDevice"/>
                        </div>
                    </div>
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
                                <div class="button chat"
                                    v-bind:class="{ active: engine.chat > 0 }"
                                    v-on:click="engineToggle('chat')">
                                    <span v-show="engine.chat === 0" class="icon">
                                        <i class="fas fa-square"></i>
                                    </span>
                                    <span v-show="engine.chat === 1" class="icon">
                                        <i class="fas fa-gear fa-spin"></i>
                                    </span>
                                    <span v-show="engine.chat === 2" class="icon">
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
                            <div class="audience-text">
                                <textarea v-show="!recording" v-model="audienceMessage"
                                    v-bind:disabled="recording"
                                    v-on:keydown.enter.prevent="audienceCommit()">
                                </textarea>
                                <div v-show="recording" class="audience-text-during-recording">
                                    {{ audienceMessage }}
                                    <span v-show="!audienceMessageFinal" class="icon">
                                        <spinner-grid class="spinner-grid" size="12"/>
                                    </span>
                                </div>
                            </div>
                            <div class="actions">
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 1, empty: state.slots.audience1 === '' }" v-on:click="audienceSlotSelect(1)">1</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 2, empty: state.slots.audience2 === '' }" v-on:click="audienceSlotSelect(2)">2</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 3, empty: state.slots.audience3 === '' }" v-on:click="audienceSlotSelect(3)">3</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 4, empty: state.slots.audience4 === '' }" v-on:click="audienceSlotSelect(4)">4</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 5, empty: state.slots.audience5 === '' }" v-on:click="audienceSlotSelect(5)">5</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 6, empty: state.slots.audience6 === '' }" v-on:click="audienceSlotSelect(6)">6</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 7, empty: state.slots.audience7 === '' }" v-on:click="audienceSlotSelect(7)">7</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 8, empty: state.slots.audience8 === '' }" v-on:click="audienceSlotSelect(8)">8</div>
                            </div>
                            <div class="actions">
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 9,  empty: state.slots.audience9  === '' }" v-on:click="audienceSlotSelect(9)">9</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 10, empty: state.slots.audience10 === '' }" v-on:click="audienceSlotSelect(10)">10</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 11, empty: state.slots.audience11 === '' }" v-on:click="audienceSlotSelect(11)">11</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 12, empty: state.slots.audience12 === '' }" v-on:click="audienceSlotSelect(12)">12</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 13, empty: state.slots.audience13 === '' }" v-on:click="audienceSlotSelect(13)">13</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 14, empty: state.slots.audience14 === '' }" v-on:click="audienceSlotSelect(14)">14</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 15, empty: state.slots.audience15 === '' }" v-on:click="audienceSlotSelect(15)">15</div>
                                <div class="button slot" v-bind:class="{ active: audienceSlot === 16, empty: state.slots.audience16 === '' }" v-on:click="audienceSlotSelect(16)">16</div>
                            </div>
                            <div class="actions">
                                <div class="button audience-listen"
                                    v-bind:class="{ recording: recording, disabled: engine.speech2text !== 2 }"
                                    v-on:click="toggleRecording()">
                                    <canvas v-show="engine.speech2text === 2" ref="audienceMeter" class="audience-meter"></canvas>
                                    <span v-show="!recording" class="icon"><i class="fas fa-circle"></i></span>
                                    <span v-show="recording" class="icon">
                                        <spinner-rings class="spinner-rings" size="30"/>
                                    </span>
                                    RECORD
                                </div>
                                <div class="button audience-commit"
                                    v-bind:class="{ disabled: audienceMessage === '' || engine.chat !== 2 }"
                                    v-on:click="audienceCommit()">
                                    <i class="icon fas fa-circle-chevron-right"></i>
                                    COMMIT
                                </div>
                            </div>
                            <div class="label">AI:</div>
                            <div class="ai-text">
                                <textarea v-model="aiMessage"
                                    class="ai-text"
                                    v-on:keydown.enter.prevent="aiCommit()">
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
                                <div class="button ai-listen disabled"
                                    v-bind:class="{ playing: playing }"
                                    v-on:click="playing = !playing">
                                    <span v-show="!playing" class="icon"><i class="fas fa-play"></i></span>
                                    <span v-show="playing" class="icon">
                                        <spinner-bars class="spinner-bars" size="16"/>
                                    </span>
                                    PLAY
                                </div>
                                <div class="button ai-speak"
                                    v-bind:class="{ disabled: aiMessage === '' || engine.text2speech !== 2 }"
                                    v-on:click="aiCommit()">
                                    <i class="icon fas fa-circle-chevron-right"></i>
                                    COMMIT
                                </div>
                            </div>
                        </div>
                        <div ref="right" class="right">
                            <div class="chat-history">
                                <div v-for="entry, i of chatLog" v-bind:key="i" class="chat-entry"
                                    v-bind:class="{ [ 'chat-entry-' + entry.persona.toLowerCase() ]: true }">
                                    <div class="chat-entry-persona">{{ entry.persona }}:</div>
                                    <div class="chat-entry-message">
                                        {{ entry.message }}
                                        <span v-show="!entry.final" class="chat-entry-message-dots">
                                            &nbsp; <spinner-grid class="spinner-grid" size="14"/>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </tab>

                <!--  ==== PREVIEW ====  -->
                <tab id="preview" name="Preview" class="preview">
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
                    <i class="fa-solid fa-circle"></i>
                </div>

                <!--  Traffic Recv  -->
                <div class="traffic recv" v-bind:class="{ active: connection.recv }">
                    <i class="fa-solid fa-circle"></i>
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
                    color: var(--color-std-fg-1)
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
    .tabs-component-tab-a
        padding: 2px 4px 2px 4px
        font-size: 11pt
    .desc
        font-weight: 200
        color: var(--color-std-fg-3)
        margin-bottom: 20px
        b
            font-weight: normal
    .control
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
            width: 100px
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
                font-weight: bold
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
                background-color: var(--color-acc-bg-1)
                color: var(--color-acc-fg-1)
                padding: 2px 8px 2px 8px
                text-align: center
        .button
            background-color: var(--color-std-bg-4)
            color: var(--color-std-fg-5)
            border-radius: 4px
            padding: 2px 8px 2px 8px
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
            font-weight: bold
            font-size: 12pt
            width: calc(400px - 2 * 12px)
            &:focus
                background-color: var(--color-acc-bg-4)
                color: var(--color-acc-fg-5)
            &:hover
                background-color: var(--color-acc-bg-5)
                color: var(--color-acc-fg-5)
        textarea
            background-color: var(--color-acc-bg-3)
            color: var(--color-acc-fg-5)
            border: 0
            border-radius: 4px
            padding: 6px 12px 6px 12px
            outline: none
            font-weight: bold
            font-size: 12pt
            width: calc(400px - 2 * 12px)
            &.prompt
                font-size: 10pt
                font-weight: normal
    .preview
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
                background-color: var(--color-std-bg-3)
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
            padding: 8px 8px 8px 8px
            font-size: 12pt
            width: auto
            height: auto
    .control-pane
        width:  100%
        height: 100%
        display: flex
        flex-direction: row
        .left
            color: var(--color-std-fg-4)
            border-radius: 4px
            width: 360px
            max-width: 360px
            min-width: 360px
            margin-right: 10px
            display: flex
            flex-direction: column
            justify-content: flex-first
            align-items: flex-first
            .actions
                display: flex
                flex-direction: row
                *
                    flex-grow: 1
            .actions:first-child
                .button
                    padding: 0 8px 2px 8px !important
                    margin-top: 0 !important
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
            height: calc(100vh - 136px - 40px)
        .button
            background-color: var(--color-std-bg-4)
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
                background-color: var(--color-std-bg-3)
                color: var(--color-std-fg-2)
            &.disabled:hover
                background-color: var(--color-std-bg-3)
                color: var(--color-std-fg-2)
                cursor: default
            &.empty
                background-color: var(--color-std-bg-1)
                color: var(--color-std-fg-1)
            &.empty:hover
                background-color: var(--color-std-bg-1)
                color: var(--color-std-fg-1)
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
            &.playing
                background-color: var(--color-sig-bg-3)
                color: var(--color-sig-fg-3)
                &:hover
                    background-color: var(--color-sig-bg-5)
                    color: var(--color-sig-fg-5)
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
        .audience-text
            flex-grow: 1
            flex-shrink: 1
            flex-basis: 50%
            overflow: hidden
            textarea
                overflow: scroll
                background-color: var(--color-acc-bg-3)
                color: var(--color-acc-fg-5)
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
                resize: none
                &:disabled
                    background-color: var(--color-acc-bg-1)
                    color: var(--color-acc-fg-3)
            .audience-text-during-recording
                overflow: scroll
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
            textarea
                overflow: scroll
                background-color: var(--color-acc-bg-3)
                color: var(--color-acc-fg-5)
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
                resize: none
                &:disabled
                    background-color: var(--color-acc-bg-1)
                    color: var(--color-acc-fg-3)
        .chat-history
            .chat-entry
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
            .chat-entry-ai
                background-color: var(--color-std-bg-2)
                color: var(--color-acc-fg-4)
            .chat-entry-studio
                background-color: var(--color-std-bg-3)
                color: var(--color-std-fg-5)
            .chat-entry-persona
                width:     70px
                max-width: 70px
                min-width: 70px
                font-weight: bold
            .chat-entry-message
                flex-grow: 1
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
        .audience-meter
            position: relative
            top: 3px
            width:  50px
            height: 16px
            margin-right: 10px
            background-color: #222
            border-radius: 4px
    .input
        width: 400px
    .slider
        width: 400px
        --slider-bg: var(--color-std-bg-4)
        --slider-handle-bg: var(--color-std-fg-5)
        --slider-connect-bg: var(--color-acc-bg-5)
        --slider-height: 20px
        --slider-handle-width: 20px
        --slider-handle-height: 20px
        --slider-tooltip-bg: var(--color-std-fg-5)
        --slider-tooltip-color: var(--color-std-bg-2)
        --slider-tooltip-font-size: 10pt
        --slider-tooltip-line-height: 12pt
        --slider-tooltip-font-weight: normal
        --slider-tooltip-radius: 4px
        --slider-tooltip-arrow-size: 8px
        --slider-tooltip-min-width: 40px
    .toggle
        --toggle-width: 60px
        --toggle-height: 20px
        --toggle-border: 0
        --toggle-bg-on: var(--color-acc-bg-5)
        --toggle-bg-off: var(--color-std-bg-2)
        --toggle-ring-width: 0
        --toggle-handle-enabled: var(--color-std-fg-5)
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
import RecWebSocket        from "@opensumi/reconnecting-websocket"
import Ducky               from "ducky"
import Slider              from "@vueform/slider"
import Toggle              from "@vueform/toggle"
import axios               from "axios"
import moment              from "moment"
import PerfectScrollbar    from "perfect-scrollbar"
import { Tabs, Tab }       from "vue3-tabs-component"
import { VueSpinnerGrid, VueSpinnerBars, VueSpinnerRings } from "vue3-spinners"
import Speech2Text, { Speech2TextChunk } from "./app-sv-speech2text"
import Chat, { ChatChunk } from "./app-sv-chat"
import {
    StateType, StateTypePartial,
    StateSchema, StateSchemaPartial,
    StateDefault,
    StatePaths,
    StateUtil
} from "../common/app-state"
</script>

<script lang="ts">
let statusTimer: ReturnType<typeof setTimeout> | null = null
let speech2text: Speech2Text | null = null
let chat: Chat | null = null
type ChatLogEntry = { persona: string, message: string, final: boolean }
export default defineComponent({
    name: "app-control",
    components: {
        "tabs":    Tabs,
        "tab":     Tab,
        "spinner-grid":  VueSpinnerGrid,
        "spinner-bars":  VueSpinnerBars,
        "spinner-rings": VueSpinnerRings
        // "slider": Slider,
        // "toggle": Toggle
    },
    props: {
        selectTab:  { type: String, default: "settings" },
        serviceUrl: { type: String, default: "" },
        wsUrl:      { type: String, default: "" }
    },
    data: () => ({
        formatSliderValue: (v: number) => v.toFixed(2),
        ps: null as PerfectScrollbar | null,
        tab: "",
        state:        StateDefault,
        stateDefault: StateDefault,
        watchState: true,
        recording: false,
        playing: false,
        audienceMessage: "",
        audienceMessageFinal: true,
        audienceSlot: 0,
        aiMessage: "",
        aiSlot: 0,
        chatLog: [] as Array<ChatLogEntry>,
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
            chat:        0,
            text2speech: 0
        }
    }),
    async mounted () {
        /*  force particular tab to be selected  */
        (this.$refs.tabs as any).selectTab(`#${this.selectTab}`)

        /*  establish server connection  */
        this.log("INFO", "establishing WebSocket connection")
        const ws = new RecWebSocket(this.wsUrl + "/control", [], {
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
            this.connection.recv = true
            setTimeout(() => {
                this.connection.recv = false
            }, 250)
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
        })

        /*  initially load state  */
        await this.loadState()

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
        this.$watch("audienceMessage", () => {
            if (this.audienceSlot === 0)
                return
            let key:
                "audience1"  | "audience2"  | "audience3"  | "audience4"  |
                "audience5"  | "audience6"  | "audience7"  | "audience8"  |
                "audience9"  | "audience10" | "audience11" | "audience12" |
                "audience13" | "audience14" | "audience15" | "audience16"
            if      (this.audienceSlot === 1)  key = "audience1"
            else if (this.audienceSlot === 2)  key = "audience2"
            else if (this.audienceSlot === 3)  key = "audience3"
            else if (this.audienceSlot === 4)  key = "audience4"
            else if (this.audienceSlot === 5)  key = "audience5"
            else if (this.audienceSlot === 6)  key = "audience6"
            else if (this.audienceSlot === 7)  key = "audience7"
            else if (this.audienceSlot === 8)  key = "audience8"
            else if (this.audienceSlot === 9)  key = "audience9"
            else if (this.audienceSlot === 10) key = "audience10"
            else if (this.audienceSlot === 11) key = "audience11"
            else if (this.audienceSlot === 12) key = "audience12"
            else if (this.audienceSlot === 13) key = "audience13"
            else if (this.audienceSlot === 14) key = "audience14"
            else if (this.audienceSlot === 15) key = "audience15"
            else if (this.audienceSlot === 16) key = "audience16"
            else
                throw new Error("invalid index")
            this.state.slots[key] = this.audienceMessage
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

        /*  activate chat-history scrolling  */
        const container = this.$refs.right as HTMLElement
        this.ps = new PerfectScrollbar(container, {
            suppressScrollX: true,
            scrollXMarginOffset: 100
        })
        this.$watch("chatLog", () => {
            this.ps!.update()
            setTimeout(() => {
                container.scrollTo({ left: 0, top: container.scrollHeight })
            }, 50)
        }, { deep: true })

        /*  establish speech-to-text engine  */
        this.log("INFO", "establishing Speech-to-Text engine")
        speech2text = new Speech2Text({
            device:   this.state.speech2text.microphoneDevice,
            apiToken: this.state.speech2text.deepgramApiToken,
            model:    this.state.speech2text.deepgramModel,
            version:  this.state.speech2text.deepgramVersion,
            language: this.state.speech2text.deepgramLanguage,
            keywords: this.state.speech2text.deepgramKeywords
        })
        speech2text.on("log", (level: string, msg: string) => {
            this.log(level, `Speech-to-Text: ${msg}`)
        })
        let audienceBuffer = [ "" ]
        speech2text.on("text", (chunk: Speech2TextChunk) => {
            audienceBuffer[audienceBuffer.length - 1] = chunk.text
            if (chunk.final) {
                audienceBuffer.push("")
                this.audienceMessageFinal = true
            }
            else
                this.audienceMessageFinal = false
            this.audienceMessage = audienceBuffer.join(" ")
        })
        await speech2text.init()

        /*  enable/disable speech-to-text engine  */
        const engineOpen = async () => {
            this.log("INFO", "Speech-to-Text: start engine")
            await speech2text!.open().catch((err) => {
                this.engine.speech2text = 0
                this.log("ERROR", `Speech-to-Text engine failed: ${err}`)
                this.raiseStatus("error", `Speech-to-Text engine failed: ${err}`, 2000)
            })
            speech2text!.audioMeterApply(this.$refs.audienceMeter as HTMLCanvasElement)
        }
        const engineClose = async () => {
            this.log("INFO", "Speech-to-Text: stop engine")
            speech2text!.audioMeterUnapply(this.$refs.audienceMeter as HTMLCanvasElement)
            await speech2text!.close()
        }
        this.$watch("engine.speech2text", async () => {
            if (speech2text === null)
                return
            if (this.engine.speech2text === 1)
                engineOpen()
            else if (this.engine.speech2text === 0)
                engineClose()
        })
        speech2text.on("open", () => {
            if (this.engine.speech2text === 1)
                this.engine.speech2text = 2
        })
        speech2text.on("close", () => {
            if (this.engine.speech2text === 2) {
                this.log("INFO", "Speech-to-Text: unexpected engine stop -- re-starting engine")
                this.engine.speech2text = 1
            }
        })
        this.$watch("recording", () => {
            if (speech2text === null)
                return
            if (this.recording) {
                this.log("INFO", "Speech-to-Text: start recording")
                speech2text.setActive(true)
                audienceBuffer = [ "" ]
            }
            else {
                this.log("INFO", "Speech-to-Text: stop recording")
                speech2text.setActive(false)
            }
        })

        /*  establish Chat engine  */
        this.log("INFO", "establishing Chat engine")
        chat = new Chat({
            apiToken:     this.state.chat.openaiApiToken,
            model:        this.state.chat.openaiModel,
            prompt:       this.state.chat.openaiPrompt,
            temperature:  this.state.chat.openaiTemperature,
            seed:         this.state.chat.openaiSeed,
            maxTokens:    this.state.chat.openaiMaxTokens
        })
        chat.on("log", (level: string, msg: string) => {
            this.log(level, `Chat: ${msg}`)
        })
        chat.on("text", (chunk: ChatChunk) => {
            const chatLog = this.chatLog as Array<ChatLogEntry>
            if (this.chatLog.length === 0
                || chatLog[chatLog.length - 1].persona === "Studio"
                || chatLog[chatLog.length - 1].final)
                chatLog.push({ persona: "AI", message: "", final: false })
            const entry = chatLog[chatLog.length - 1]
            entry.message = chunk.text
            entry.final   = chunk.final
        })
        await chat.init()

        /*  enable/disable chat engine  */
        const chatEngineOpen = async () => {
            this.log("INFO", "Chat: start engine")
            await chat!.open().catch((err) => {
                this.engine.chat = 0
                this.log("ERROR", `Chat engine failed: ${err}`)
                this.raiseStatus("error", `Chat engine failed: ${err}`, 2000)
            })
        }
        const chatEngineClose = async () => {
            this.log("INFO", "Chat: stop engine")
            await chat!.close()
        }
        this.$watch("engine.chat", async () => {
            if (chat === null)
                return
            if (this.engine.chat === 1)
                chatEngineOpen()
            else if (this.engine.chat === 0)
                chatEngineClose()
        })
        chat.on("open", () => {
            if (this.engine.chat === 1)
                this.engine.chat = 2
        })
        chat.on("close", () => {
            if (this.engine.chat === 2) {
                this.log("INFO", "Chat: unexpected engine stop -- re-starting engine")
                this.engine.chat = 1
            }
        })
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
        tabChanged (tab: any) {
            this.tab = tab.tab.computedId
            window.location.hash = `#/control/${this.tab}`
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
            this.connection.recv = true
            const state = await axios({
                method: "GET",
                url:    `${this.serviceUrl}state`
            }).then((response) => response.data).catch(() => null).finally(() => {
                this.connection.recv = false
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
            this.connection.send = true
            await axios({
                method: "POST",
                url:    `${this.serviceUrl}state`,
                data:   this.state
            }).finally(() => {
                this.connection.send = false
            })
        },

        /*  patch current state  */
        async patchState (paths: Readonly<string[]>) {
            const state = {}
            StateUtil.copy(state, this.state, paths)
            this.connection.send = true
            await axios({
                method: "PATCH",
                url:    `${this.serviceUrl}state`,
                data:   state
            }).finally(() => {
                this.connection.send = false
            })
        },

        /*  commit Audience text  */
        audienceCommit () {
            if (this.audienceMessage === "" || !this.engine.chat || chat === null)
                return
            this.chatLog.push({ persona: "Studio", message: this.audienceMessage, final: true })
            // this.audienceMessage = ""
            // this.audienceSlot = 0
            chat.send(this.audienceMessage)
        },

        /*  select Audience slot  */
        audienceSlotSelect (n: number) {
            if (this.audienceSlot === n) {
                this.audienceSlot = 0
                this.audienceMessage = ""
            }
            else {
                this.audienceSlot = n
                let val
                if      (n === 1)  val = this.state.slots.audience1
                else if (n === 2)  val = this.state.slots.audience2
                else if (n === 3)  val = this.state.slots.audience3
                else if (n === 4)  val = this.state.slots.audience4
                else if (n === 5)  val = this.state.slots.audience5
                else if (n === 6)  val = this.state.slots.audience6
                else if (n === 7)  val = this.state.slots.audience7
                else if (n === 8)  val = this.state.slots.audience8
                else if (n === 9)  val = this.state.slots.audience9
                else if (n === 10) val = this.state.slots.audience10
                else if (n === 11) val = this.state.slots.audience11
                else if (n === 12) val = this.state.slots.audience12
                else if (n === 13) val = this.state.slots.audience13
                else if (n === 14) val = this.state.slots.audience14
                else if (n === 15) val = this.state.slots.audience15
                else if (n === 16) val = this.state.slots.audience16
                else
                    throw new Error("invalid index")
                this.audienceMessage = val
            }
        },

        /*  commit AI text  */
        aiCommit () {
            if (this.aiMessage === "" || !this.engine.text2speech)
                return
            this.aiMessage = ""
            this.aiSlot = 0
            console.log("FUCK", this.aiMessage)
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
            if (!this.recording) {
                /*  start recording  */
                this.recording = true
                this.audienceMessage = ""
            }
            else {
                /*  stop recording  */
                this.recording = false
            }
        },

        /*  toggle engine  */
        engineToggle (engine: "speech2text" | "chat" | "text2speech") {
            if (this.engine[engine] === 2)
                this.engine[engine] = 0
            else if (this.engine[engine] === 0)
                this.engine[engine] = 1
        }
    }
})
</script>

