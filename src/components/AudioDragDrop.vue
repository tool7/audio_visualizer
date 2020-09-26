<template>
  <div>
    <el-upload action="#" :auto-upload="false" :on-change="onChange" drag>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        Drop your audio file here or <em>click here</em> to select it
      </div>
      <div class="el-upload__tip" slot="tip">
        audio files with a size less than 10MB
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    test: {
      type: String,
      required: false,
    },
  },
  methods: {
    onChange(file) {
      this.loadFile(file.raw)
    },
    visualizeAudio(url) {
      fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => visualize(audioBuffer))
    },
    loadFile(file) {
      const reader = new FileReader()
      const audioContext = new AudioContext()

      reader.onload = async e => {
        const arrayBuffer = e.target.result
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

        const source = audioContext.createBufferSource()
        source.buffer = audioBuffer
        source.connect(audioContext.destination)
        source.start()
      }
      reader.readAsArrayBuffer(file)
    },
  },
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
