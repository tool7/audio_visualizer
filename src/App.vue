<template>
  <div id="app">
    <audio-file-selector @select="audioFile = $event" />
    <br />
    <audio-visualizer :file="audioFile" ref="audioVisualizer" />
    <br />
    <el-button @click="onStart" :disabled="!audioFile" :loading="isPlaying">PLAY</el-button>
  </div>
</template>

<script>
import AudioFileSelector from "./components/AudioFileSelector.vue"
import AudioVisualizer from "./components/AudioVisualizer.vue"

export default {
  name: "App",
  components: {
    AudioFileSelector,
    AudioVisualizer,
  },
  data() {
    return {
      audioFile: null,
      isPlaying: false,
    }
  },
  methods: {
    onStart() {
      this.isPlaying = true
      this.$refs.audioVisualizer.start()
    },
  },
}
</script>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 100px;
}
</style>
