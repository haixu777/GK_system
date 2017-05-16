<template lang="html">
  <div class="data_entry_container">
    <Upload
      multiple
      type="drag"
      action="http://localhost:3000/control/uploadFile">
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>点击或将文件拖拽到这里上传</p>
      </div>
    </Upload>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
