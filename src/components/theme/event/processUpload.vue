<template lang="html">
  <div class="process_upload_container">
    <el-upload
      v-if="!imageUrl"
      class="uploader"
      :action="'//'+ localUrl +':3000/events/process_upload'"
      :data="{ eventId: eventId }"
      :show-file-list="false"
      :on-success="handleAvatarScucess"
      :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="process_image">
      <i v-else class="el-icon-plus uploader-icon"></i>
    </el-upload>
    <div v-else style="position:relative;">
      <Button v-if="isAdmin" size="small" type="warning" style="position:absolute;right:0;top:2px;" icon="ios-trash" @click="delImage"></Button>
      <vue-images :imgs="[{imageUrl: imageUrl}]" showclosebutton modalclose>
      </vue-images>
    </div>
  </div>
</template>

<script>
const $utils = require('utils')
const vueImages = require('vue-images')
export default {
  data () {
    return {
      imageUrl: '',
      localUrl: ''
    }
  },
  props: ['eventId'],
  components: {
    vueImages: vueImages.default,
    isAdmin: ''
  },
  watch: {
    eventId () {
      this.fetchProcessImageFromServer()
    }
  },
  methods: {
    fetchProcessImageFromServer () {
      if (!this.eventId) return
      this.isAdmin = $utils.Cookie.get('isAdmin').toString() === 'true'
      this.$axios.get('events/process_image', {
        params: {
          eventId: this.eventId
        }
      }).then((res) => {
        if (res.data.success) {
          var base64 = btoa(
            new Uint8Array(res.data.buffer.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
          )
          var datajpg = 'data:image/jpg;base64,' + base64
          this.imageUrl = datajpg
        } else {
          this.imageUrl = ''
          console.log(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    delImageFromServer () {
      this.$axios.post('/events/process_image/del', {eventId: this.eventId})
        .then((res) => {
          if (res.data.success) {
            this.$Notice.success({
              title: '图片删除成功'
            })
            this.imageUrl = ''
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    handleAvatarScucess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isAdmin = $utils.Cookie.get('isAdmin').toString() === 'true'
      if (!isAdmin) {
        this.$Message.error('无法上传：非管理员用户')
        return false
      }
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$Message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$Message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    delImage () {
      this.$Modal.confirm({
        title: '确认删除图片',
        content: '图片删除将无法恢复',
        onOk: () => {
          this.delImageFromServer()
        },
        onCancel: () => {
          this.$Message.warning('操作取消')
        }
      })
    },
    handleLocalUrl () {
      if (process.env.NODE_ENV === 'development') {
        this.localUrl = '10.10.28.23'
      } else {
        this.localUrl = 'localhost'
      }
    }
  },
  mounted () {
    this.handleLocalUrl()
    this.fetchProcessImageFromServer()
  }
}
</script>

<style lang="scss">
.uploader {
  text-align: center;
}
.uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
}
.uploader .el-upload:hover {
  border-color: #20a0ff;
}
.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.process_image {
  width: 100%;
}
.image-wrapper {
  .header {
    .play {
      display: none !important;
    }
    .full {
      display: none !important;
    }
  }
}
.vue-images {
  .lightbox {
    overflow: auto !important;
    img {
      max-height: inherit !important;
    }
  }
  .wrapper {
    img {
      width: 100% !important;
      height: inherit !important;
    }
  }
}
</style>
