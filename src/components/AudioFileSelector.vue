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
    <div></div>
  </div>
</template>

<script>
export default {
  methods: {
    onChange(file) {
      this.$emit("select", file.raw)
    },
  },
}
</script>

<style scoped></style>
