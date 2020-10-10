<template>
  <canvas ref="canvas" width="1024" height="500"></canvas>
</template>

<script>
export default {
  props: {
    file: {
      type: File,
      default: null,
    },
    visualizerType: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      analyser: null,
      frequencyData: null,
      canvasCtx: null,
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

      this.canvasCtx = this.$refs.canvas.getContext("2d")
      this.analyser = audioContext.createAnalyser()
      // TODO: Make it variable
      this.analyser.fftSize = 1024
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount)

      reader.onload = async e => {
        audio.src = e.target.result
        audio.play()

        const source = audioContext.createMediaElementSource(audio)
        source.connect(this.analyser)
        this.analyser.connect(audioContext.destination)

        switch (this.visualizerType) {
          case "line-bars":
            this.drawLineBarsVisualizer()
            break
          case "circle-bars":
            this.drawCircleBarsVisualizer()
            break
          case "sinewave":
            this.drawSineWave()
            break
        }
      }
      reader.readAsDataURL(this.file)
    },
    drawLineBarsVisualizer() {
      requestAnimationFrame(this.drawLineBarsVisualizer)
      this.analyser.getByteFrequencyData(this.frequencyData)

      const canvasWidth = this.$refs.canvas.width
      const canvasHeight = this.$refs.canvas.height

      this.canvasCtx.fillStyle = "#333"
      this.canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight)
      this.canvasCtx.fillStyle = "orange"
      this.canvasCtx.beginPath()

      const barWidth = canvasWidth / this.analyser.frequencyBinCount
      let x = 0

      for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
        const barHeight = this.frequencyData[i]
        this.canvasCtx.fillRect(x, canvasHeight - barHeight, barWidth, barHeight)

        x += barWidth + (this.options.gutter || 2)
      }
    },
    drawCircleBarsVisualizer() {
      requestAnimationFrame(this.drawCircleBarsVisualizer)
      this.analyser.getByteFrequencyData(this.frequencyData)

      const canvas = this.$refs.canvas
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 120
      const barWidth = this.options.gutter || 2
      // TODO: Make it variable (Must be lower than this.frequencyData.length!!!)
      const barCount = 200
      const radians = (Math.PI * 2) / barCount

      this.canvasCtx.fillStyle = "#333"
      this.canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

      this.canvasCtx.beginPath()
      this.canvasCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      this.canvasCtx.stroke()

      for (let i = 0; i < barCount; i++) {
        const frequency = this.frequencyData[i]
        // TODO: Make '0.7' variable
        const barHeight = frequency * 0.7
        const sine = Math.sin(radians * i)
        const cosine = Math.cos(radians * i)
        const x = centerX + cosine * radius
        const y = centerY + sine * radius
        const xEnd = centerX + cosine * (radius + barHeight)
        const yEnd = centerY + sine * (radius + barHeight)

        const lineColor = "rgb(" + frequency + ", " + frequency + ", " + 205 + ")"
        this.canvasCtx.strokeStyle = lineColor
        this.canvasCtx.lineWidth = barWidth
        this.canvasCtx.beginPath()
        this.canvasCtx.moveTo(x, y)
        this.canvasCtx.lineTo(xEnd, yEnd)
        this.canvasCtx.stroke()
      }
    },
    drawSineWave() {
      requestAnimationFrame(this.drawSineWave)
      this.analyser.getByteTimeDomainData(this.frequencyData)

      const canvas = this.$refs.canvas

      this.canvasCtx.fillStyle = "#333"
      this.canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
      this.canvasCtx.lineWidth = 2
      this.canvasCtx.strokeStyle = "orange"
      this.canvasCtx.beginPath()

      const sliceWidth = canvas.width / this.analyser.frequencyBinCount
      let x = 0

      for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
        const v = this.frequencyData[i] / 128
        const y = (v * canvas.height) / 2

        if (i === 0) {
          this.canvasCtx.moveTo(x, y)
        } else {
          this.canvasCtx.lineTo(x, y)
        }
        x += sliceWidth
      }

      this.canvasCtx.lineTo(canvas.width, canvas.height / 2)
      this.canvasCtx.stroke()
    },
  },
}
</script>

<style scoped></style>
