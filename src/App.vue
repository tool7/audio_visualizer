<template>
  <div class="app">
    <h1 class="title">Audio Visualizer</h1>
    <el-tabs type="border-card">
      <el-tab-pane label="LINE BARS">
        <audio-visualizer
          :file="audioFile"
          :config="visualizerConfig"
          visualizer-type="line-bars"
          ref="lineBarsVisualizer"
        />
      </el-tab-pane>
      <el-tab-pane label="CIRCLE BARS">
        <audio-visualizer
          :file="audioFile"
          :config="visualizerConfig"
          visualizer-type="circle-bars"
          ref="circleBarsVisualizer"
        />
      </el-tab-pane>
      <el-tab-pane label="SINE WAVE">
        <audio-visualizer
          :file="audioFile"
          :config="visualizerConfig"
          visualizer-type="sinewave"
          ref="sineWaveVisualizer"
        />
      </el-tab-pane>
    </el-tabs>
    <br />
    <audio-file-selector @select="audioFile = $event" />
    <br />
    <el-button @click="onStart" :disabled="!audioFile" :loading="isPlaying">PLAY</el-button>
  </div>
</template>

<script>
import * as dat from "dat.gui"
import AudioFileSelector from "./components/AudioFileSelector.vue"
import AudioVisualizer from "./components/AudioVisualizer.vue"

const gui = new dat.GUI()

export default {
  name: "App",
  components: {
    AudioFileSelector,
    AudioVisualizer,
  },
  data() {
    return {
      visualizerConfig: {
        barColor: "#ffa500",
        backgroundColor: "#333",
        sampleDensity: 100,
        amplitudeMultiplier: 1,
        lineBarMargin: 2,
        circleRadius: 100,
        circleBarThickness: 2,
        circleThickness: 2,
        sineWaveLineThickness: 2,
      },
      audioFile: null,
      isPlaying: false,
    }
  },
  mounted() {
    gui.width = 350

    const generalConfig = gui.addFolder("General")
    generalConfig.closed = false
    generalConfig.addColor(this.visualizerConfig, "barColor").name("Bar color")
    generalConfig.addColor(this.visualizerConfig, "backgroundColor").name("Background color")
    generalConfig.add(this.visualizerConfig, "sampleDensity", 10, 1000).name("Sample density")
    generalConfig
      .add(this.visualizerConfig, "amplitudeMultiplier", 0.1, 2)
      .name("Amplitude multiplier")

    const lineVisualizerConfig = gui.addFolder("Line bars")
    lineVisualizerConfig.closed = false
    lineVisualizerConfig.add(this.visualizerConfig, "lineBarMargin", 0, 50).name("Bar margin")

    const circleVisualizerConfig = gui.addFolder("Circle bars")
    circleVisualizerConfig.closed = false
    circleVisualizerConfig.add(this.visualizerConfig, "circleRadius", 10, 500).name("Radius")
    circleVisualizerConfig
      .add(this.visualizerConfig, "circleBarThickness", 1, 50)
      .name("Bar thickness")
    circleVisualizerConfig
      .add(this.visualizerConfig, "circleThickness", 1, 50)
      .name("Circle thickness")

    const sineWaveVisualizer = gui.addFolder("Sine wave")
    sineWaveVisualizer.closed = false
    sineWaveVisualizer
      .add(this.visualizerConfig, "sineWaveLineThickness", 1, 50)
      .name("Line thickness")
  },
  methods: {
    onStart() {
      this.isPlaying = true
      this.$refs.lineBarsVisualizer.start()
      this.$refs.circleBarsVisualizer.start()
      this.$refs.sineWaveVisualizer.start()
    },
  },
}
</script>

<style>
.app {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.title {
  color: #606266;
}
</style>
