<template>
  <canvas ref="canvas" width="1024" height="512"></canvas>
</template>

<script>
import { nextPowerOf2 } from "../util/helpers"

export default {
  props: {
    frequencyData: {
      type: Uint8Array,
      default: [],
    },
    visualizerType: {
      type: String,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      canvasCtx: null,
    }
  },
  methods: {
    start() {
      this.canvasCtx = this.$refs.canvas.getContext("2d")

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
    },
    drawLineBarsVisualizer() {
      requestAnimationFrame(this.drawLineBarsVisualizer)
      this.$emit("animation-frame")

      const canvasWidth = this.$refs.canvas.width
      const canvasHeight = this.$refs.canvas.height

      this.canvasCtx.fillStyle = this.config.backgroundColor
      this.canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight)
      this.canvasCtx.fillStyle = this.config.barColor
      this.canvasCtx.beginPath()

      const barWidth = canvasWidth / this.config.sampleDensity
      let x = 0

      for (let i = 0; i < this.config.sampleDensity; i++) {
        const frequency = this.frequencyData[i]
        const barHeight = frequency * this.config.amplitudeMultiplier
        this.canvasCtx.fillRect(x, canvasHeight - barHeight, barWidth, barHeight)

        x += barWidth + this.config.lineBarMargin
      }
    },
    drawCircleBarsVisualizer() {
      requestAnimationFrame(this.drawCircleBarsVisualizer)
      this.$emit("animation-frame")

      const canvas = this.$refs.canvas
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = this.config.circleRadius
      const barWidth = this.config.circleBarThickness
      const radians = (Math.PI * 2) / this.config.sampleDensity

      this.canvasCtx.lineWidth = this.config.circleThickness
      this.canvasCtx.fillStyle = this.config.backgroundColor
      this.canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

      this.canvasCtx.beginPath()
      this.canvasCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      this.canvasCtx.stroke()

      for (let i = 0; i < this.config.sampleDensity; i++) {
        const frequency = this.frequencyData[i]
        const barHeight = frequency * this.config.amplitudeMultiplier
        const sine = Math.sin(radians * i)
        const cosine = Math.cos(radians * i)
        const x = centerX + cosine * radius
        const y = centerY + sine * radius
        const xEnd = centerX + cosine * (radius + barHeight)
        const yEnd = centerY + sine * (radius + barHeight)

        this.canvasCtx.strokeStyle = this.config.barColor
        this.canvasCtx.lineWidth = barWidth
        this.canvasCtx.beginPath()
        this.canvasCtx.moveTo(x, y)
        this.canvasCtx.lineTo(xEnd, yEnd)
        this.canvasCtx.stroke()
      }
    },
    drawSineWave() {
      requestAnimationFrame(this.drawSineWave)
      this.$emit("animation-frame")

      const canvas = this.$refs.canvas

      this.canvasCtx.fillStyle = this.config.backgroundColor
      this.canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
      this.canvasCtx.lineWidth = this.config.sineWaveLineThickness
      this.canvasCtx.strokeStyle = this.config.barColor
      this.canvasCtx.beginPath()

      const sliceWidth = canvas.width / this.config.sampleDensity
      let x = 0

      for (let i = 0; i < this.frequencyData.length; i++) {
        const normalizedFrequency = this.frequencyData[i] - 128
        const y = canvas.height / 2 + normalizedFrequency * this.config.amplitudeMultiplier

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
