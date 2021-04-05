<template>
    <div>
        <audio :src="url" :loop="audio.reply" @ended="onEnded" ref="audio" @timeupdate="onTimeupdate"
            @loadedmetadata="onLoadedmetadata" @play="audio.playing = true" @pause="audio.playing = false"
            class="hidden">
        </audio>
        <div class="app-panel">
            <div class="app-item ap-playback">
                <button class="ap-controls" @click="skipBack">
                    <vue-feather type="skip-back" />
                </button>
                <button class="ap-controls" @click="onPlay" v-if="!audio.playing">
                    <vue-feather type="play" />
                </button>
                <button class="ap-controls" @click="onPause" v-else>
                    <vue-feather type="pause" />
                </button>
                <button class="ap-controls" @click="skikpForward">
                    <vue-feather type="skip-forward" />
                </button>
            </div>
            <div class="app-item ap-track">
                <div class="app-info">
                    <div class="track-title">
                        <span class="text-xs">{{ title }}</span>
                    </div>
                    <div class="track-time">
                        <span class="text-xs">{{ audio.currentTime | formatSecond }} /
                            {{audio.duration | formatSecond}}</span>
                    </div>
                    <div class="track-slider">
                        <el-slider @change="changeTime" v-model="sliderTime" :show-tooltip="false"></el-slider>
                    </div>
                </div>
            </div>
            <div class="app-item ap-settings">
                <div class="ap-controls ap-volume-container">
                    <button @click="mute" class="ap-volume-btn">
                        <vue-feather v-if="!audio.mute" type="volume-2" />
                        <vue-feather v-else type="volume-x" />
                    </button>
                    <div class="ap-volume">
                        <el-slider class="slider" vertical v-model="audio.volume" height="100px" @change="changeVolume"
                            :show-tooltip="false" />
                    </div>
                </div>
                <button @click="audio.reply = !audio.reply" :class="{'bg-gray-300': audio.reply}" class="ap-controls">
                    <vue-feather type="repeat" />
                </button>
                <button class="ap-controls" :class="{'bg-gray-300': audio.shuffle}"
                    @click="audio.shuffle = !audio.shuffle">
                    <vue-feather type="shuffle" />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    import timeFormat from '../js/timeFormat';

    export default {
        data() {
            return {
                file: null,
                audio: {
                    playing: false,
                    reply: false,
                    shuffle: false,
                    volume: 50,
                    currentTime: 0,
                    mute: false,
                    duration: 0,
                },
                sliderTime: 0,
            }
        },
        components: {
            VueFeather
        },
        methods: {
            onPlay() {

                if (this.file == null) {
                    this.file = this.$store.getters.getFiles[this.$store.getters.getIndex];
                }
                this.$nextTick(() => {
                    this.$refs.audio.play();
                }, 500)
            },
            onPause() {
                this.$refs.audio.pause();
            },
            onTimeupdate(res) {
                this.audio.currentTime = res.target.currentTime;
                this.sliderTime = parseInt(this.audio.currentTime / this.audio.duration * 100)
            },
            mute() {
                if (this.audio.mute != true) {
                    this.audio.volume = 0;

                } else {
                    this.audio.volume = 50;
                }  
                
                this.$refs.audio.volume = this.audio.volume / 100;
                this.audio.mute = !this.audio.mute;

            },
            changeTime(index) {
                var time = parseInt(index / 100 * this.audio.duration);

                this.$refs.audio.currentTime = time;
            },
            changeVolume(volume) {
                this.$refs.audio.volume = volume / 100;
            },
            setAudio(file) {
                this.file = file;

                this.onPlay();

                const files = Array.from(this.$store.getters.getFiles);

                this.$store.dispatch('setAudioIndex', files.indexOf(file));

            },
            skipBack() {
                if (this.$store.getters.getIndex == 0)
                    return;

                const file = this.$store.getters.getFiles[this.$store.getters.getIndex - 1];

                this.setAudio(file);

            },
            skikpForward() {
                if (this.$store.getters.getIndex == this.$store.getters.getFiles.length - 1)
                    return;

                const file = this.$store.getters.getFiles[this.$store.getters.getIndex + 1];

                this.setAudio(file);

            },
            shuffle() {
                if (this.$store.getters.getFiles.length == 0)
                    return;

                const randIndex = Math.floor(Math.random() * (this.$store.getters.getFiles.length - 0) + 0);

                const file = this.$store.getters.getFiles[randIndex];

                this.setAudio(file);

            },
            onEnded() {
                if (this.$store.getters.getFiles.length == this.$store.getters.getIndex + 1)
                    return;

                if (this.audio.shuffle == true) {
                    this.shuffle();

                    return;
                }

                const files = this.$store.getters.getFiles;

                const file = files[this.$store.getters.getIndex + 1];

                if (file != null) {
                    this.$nextTick(() => {
                        this.setAudio(file);
                    }, 500);
                }
            },
            onLoadedmetadata(res) {
                var duration = parseInt(res.target.duration)

                this.audio.duration = duration;

                this.audio.volume = res.target.volume * 100;
            }
        },
        computed: {
            url() {
                return this.file != null ? this.file.url : ''
            },
            title() {
                return this.file != null ? this.file.title : '-----'
            }
        },
        filters: {
            formatSecond(second = 0) {
                return timeFormat(second)
            }
        }
    }
</script>