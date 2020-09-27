<template>
  <div class="visualizer">
    <div class="bars" ref="bars">
      <div v-for="n in 32" :key="n"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    file: {
      type: File,
      default: null,
    },
  },
  data() {
    return {
      analyser: null,
      frequencyData: null,
    }
  },
  methods: {
    start() {
      if (!this.file) {
        return
      }

      const reader = new FileReader()
      const audioContext = new AudioContext()
      const audio = new Audio()

      this.analyser = audioContext.createAnalyser()
      this.analyser.fftSize = 64
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount)

      reader.onload = async e => {
        audio.src = e.target.result
        audio.play()

        const source = audioContext.createMediaElementSource(audio)
        source.connect(this.analyser)
        this.analyser.connect(audioContext.destination)

        this.update()
      }
      reader.readAsDataURL(this.file)
    },
    update() {
      requestAnimationFrame(this.update)

      this.analyser.getByteFrequencyData(this.frequencyData)

      this.$refs.bars.children.forEach((bar, index) => {
        bar.style.height = this.frequencyData[index] + "px"
      })
    },
  },
}
</script>

<style scoped>
.visualizer {
  position: relative;
  height: 300px;
  background-color: #333;
}
.bars {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: scaleY(-1) translateX(-50%);
}
.bars > * {
  height: 8px;
  width: 20px;
  margin-right: 10px;
  background-color: orange;
}
</style>
