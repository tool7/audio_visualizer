<template>
  <div id="app">
    <audio-drag-drop />
    <br />
    <el-button @click="onClick">Button</el-button>
  </div>
</template>

<script>
import AudioDragDrop from "./components/AudioDragDrop.vue"

export default {
  name: "App",
  components: {
    AudioDragDrop,
  },
  methods: {
    onClick() {
      alert("test")
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
  color: #2c3e50;
  margin-top: 60px;
}
</style>
