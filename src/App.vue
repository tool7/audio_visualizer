<template>
  <div id="app">
    <audio-file-selector @select="audioFile = $event" />
    <br />
    <audio-visualizer :file="audioFile" :visualizer-type="visualizerType" ref="audioVisualizer" />
    <br />
    <el-select v-model="visualizerType" placeholder="Select visualizer">
      <el-option label="Line bars" value="line-bars"></el-option>
      <el-option label="Circle bars" value="circle-bars"></el-option>
      <el-option label="Sine wave" value="sinewave"></el-option>
    </el-select>
    <br />
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
      visualizerType: "line-bars",
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
