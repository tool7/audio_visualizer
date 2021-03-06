<template>
  <div>
    <el-upload action="#" :auto-upload="false" :on-change="onChange" :show-file-list="false">
      <el-button type="default">
        <i class="el-icon-upload"></i>
        Select audio file
      </el-button>
    </el-upload>
    <div></div>
  </div>
</template>

<script>
export default {
  methods: {
    onChange(file) {
      const isAudioFile = file.raw.type.includes("audio/")

      if (!isAudioFile) {
        this.$notify.error({
          title: "Error",
          message: "The file must be an audio type",
        })
        return
      }

      this.$emit("select", file.raw)
    },
  },
}
</script>

<style scoped></style>
