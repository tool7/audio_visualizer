<template>
  <div class="app">
    <h1 class="title">Audio Visualizer</h1>

    <el-tabs v-model="activeTab" @tab-click="onTabClick" type="border-card">
      <el-tab-pane label="LINE BARS" name="line-bars">
        <audio-visualizer
          :frequency-data="byteFrequencyData"
          :config="visualizerConfig"
          visualizer-type="line-bars"
          @animation-frame="onAnimationFrame"
          ref="lineBarsVisualizer"
        />
      </el-tab-pane>
      <el-tab-pane label="CIRCLE BARS" name="circle-bars">
        <audio-visualizer
          :frequency-data="byteFrequencyData"
          :config="visualizerConfig"
          visualizer-type="circle-bars"
          @animation-frame="onAnimationFrame"
          ref="circleBarsVisualizer"
        />
      </el-tab-pane>
      <el-tab-pane label="SINE WAVE" name="sinewave">
        <audio-visualizer
          :frequency-data="byteTimeDomainData"
          :config="visualizerConfig"
          visualizer-type="sinewave"
          @animation-frame="onAnimationFrame"
          ref="sineWaveVisualizer"
        />
      </el-tab-pane>
    </el-tabs>
    <br />
    <audio-file-selector @select="audioFile = $event" />
    <br />
    <audio controls ref="audioPlayer"></audio>
    <br />
    <el-button @click="onStart" :disabled="!audioFile" :loading="isPlaying">PLAY</el-button>
  </div>
</template>

<script>
import * as dat from "dat.gui"
import { nextPowerOf2 } from "./util/helpers"
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
      sampleDensityOldValue: 100,
      analyser: null,
      byteFrequencyData: null,
      byteTimeDomainData: null,
      activeTab: "line-bars",
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
      .add(this.visualizerConfig, "sineWaveLineThickness", 1, 20)
      .name("Line thickness")

    const audioContext = new AudioContext()
    this.analyser = audioContext.createAnalyser()
    this.analyser.fftSize = nextPowerOf2(this.visualizerConfig.sampleDensity) * 2
    this.analyser.connect(audioContext.destination)

    const mediaElementSource = audioContext.createMediaElementSource(this.$refs.audioPlayer)
    mediaElementSource.connect(this.analyser)

    this.byteFrequencyData = new Uint8Array(this.analyser.frequencyBinCount)
    this.byteTimeDomainData = new Uint8Array(this.analyser.frequencyBinCount)
  },
  watch: {
    visualizerConfig: {
      deep: true,
      handler() {
        if (this.visualizerConfig.sampleDensity === this.sampleDensityOldValue) {
          return
        }

        this.sampleDensityOldValue = this.visualizerConfig.sampleDensity

        this.analyser.fftSize = nextPowerOf2(this.visualizerConfig.sampleDensity) * 2
        this.byteFrequencyData = new Uint8Array(this.analyser.frequencyBinCount)
        this.byteTimeDomainData = new Uint8Array(this.analyser.frequencyBinCount)
      },
    },
  },
  methods: {
    onTabClick() {
      if (!this.isPlaying) {
        return
      }
      this.startVisualizer()
    },
    onStart() {
      this.isPlaying = true

      const reader = new FileReader()
      reader.onload = async e => {
        this.$refs.audioPlayer.src = e.target.result
        this.$refs.audioPlayer.play()

        this.startVisualizer()
      }
      reader.readAsDataURL(this.audioFile)
    },
    startVisualizer() {
      switch (this.activeTab) {
        case "line-bars":
          this.$refs.lineBarsVisualizer.start()
          break
        case "circle-bars":
          this.$refs.circleBarsVisualizer.start()
          break
        case "sinewave":
          this.$refs.sineWaveVisualizer.start()
          break
      }
    },
    onAnimationFrame() {
      this.analyser.getByteFrequencyData(this.byteFrequencyData)
      this.analyser.getByteTimeDomainData(this.byteTimeDomainData)
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
