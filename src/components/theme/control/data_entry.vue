<template lang="html">
  <div class="data_entry_container">
    <div class="" style="display:flex;display:-webkit-flex;justify-content:center;">
      <div class="control_upload_container">
        <Upload
          multiple
          type="drag"
          accept="text/plain"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :show-upload-list="false"
          :action="localUrl +'/control/upload'">
          <div style="padding: 20px 0" class="btn_upload">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>扫描文件上传区</p>
            <p>点击此区域上传文件</p>
          </div>
        </Upload>
      </div>
      <div class="chouqu_container">
        <div class="" style="padding-top:25px;font-size:18px;font-weight:bolder;">
          抽取日期
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="" style="padding-top:20px;">
          <el-button
            style="width:180px;height:50px;font-size:18px;font-weight:bolder;"
            type="success"
            size="large"
            @click="controlExtract()"
            :disabled="fileList.length == 0">日志抽取
          </el-button>
        </div>
      </div>
    </div>
    <div class="extractList_container" v-if="fileList.length !== 0">
      <div class="item_container" v-for="file in fileList">
        <div class="delete_btn" @click="deleteToServer(file)">
          <Icon type="close-circled"></Icon>
        </div>
        <div class="item">
          <div class="icon">
            <img :src="icon" width="100%" height="100%" alt="file">
          </div>
          <div class="text">
            {{ nameCut(file.name) }}
          </div>
        </div>
      </div>
    </div>
    <div class="extractList_container" v-else>
      <div class="empty_container">
        <p>暂无录入任务</p>
        <p>请上传日志文件</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      icon: require('assets/file.png'),
      fileList: [],
      localUrl: process.env.URL,
      date: new Date()
    }
  },
  methods: {
    fetchScanListFromServer () {
      this.$axios.get('/control/extractList')
        .then((res) => {
          this.fileList = res.data.data
        }).catch((err) => {
          console.log(err)
        })
    },
    controlExtract () {
      this.$axios.post('/control/extract', {
        path: '',
        date: this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate()
      }).then((res) => {
        this.$Notice.success({
          title: '抽取完成，请在管控历史页面查看',
          desc: '共抽取管控记录 ' + res.data.num + ' 条',
          duration: 0
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    beforeUpload (file) {
      return this.checkIsExistFromServer(file.name)
    },
    deleteToServer (file) {
      this.$axios.post('/control/fileDelete', {
        filename: file.name
      }).then((res) => {
        console.log(res)
        this.fetchScanListFromServer()
      }).catch((err) => {
        console.log(err)
      })
    },
    handleUploadSuccess (msg) {
      this.fetchScanListFromServer()
    },
    checkRepeatFile (filename) {
      for (var i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i] === filename) {
          return true
        } else {
          return false
        }
      }
    },
    checkIsExistFromServer (filename) {
      return new Promise((resolve, reject) => {
        if (filename.indexOf(' ') !== -1) {
          return new Promise((resolve, reject) => {
            reject()
            this.$Notice.error({
              title: `上传 ${filename} 失败`,
              desc: `文件: ${filename}，文件名内不能有空格存在`
            })
          })
        } else if (this.checkRepeatFile(filename)) {
          reject()
          this.$Notice.error({
            title: `上传 ${filename} 失败`,
            desc: `文件名: ${filename}，重复`
          })
        } else {
          resolve()
        }
      })
    },
    nameCut (filename) {
      let name = ''
      if (filename.length > 12) {
        name = filename.slice(0, 11) + '...'
      } else {
        name = filename
      }
      return name
    }
  },
  mounted () {
    this.fetchScanListFromServer()
    this.$axios.get('http://localhost:8012/day?path=testData/2016/11/10')
    .then((res) => {
      console.log(res)
    })
  }
}
</script>

<style lang="scss">
.extractList_container {
  background: #F2F6FC;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border: 1px solid #dfe6ec;
  border-radius: 5px;
  padding: 10px;
  margin: 5px;
  min-height: 400px;
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  .item_container {
    width: 120px;
    height: 160px;
    padding: 10px;
    border-radius: 10px;
    position: relative;
    margin: 0 10px;
    transition: all 0.38s ease-out;
    .delete_btn {
      position: absolute;
      top: 0;
      right: 0;
      color: red;
      display: none;
      font-size: 18px;
    }
    &:hover {
      background: #ddd;
      .delete_btn {
        display: block;
      }
    }
    .item {
      width: 100px;
      min-height: 170px;
      .icon {
        width: 100%;
        height: 100px;
      }
      .text {
        word-break: break-all;
      }
    }
  }
  .empty_container {
    padding-top: 60px;
    width: 100%;
    text-align: center;
    font-size: 20px;
    font-weight: bolder;
  }
}
.control_upload_container {
  width: 78%;
  padding: 10px;
  border: 1px solid #ddd;
}
.chouqu_container {
  width: 22%;
  padding: 10px;
  border: 1px solid #ddd;
}
.btn_upload {
  border: 1px solid #57a3f3;
  background: #409EFF;
  color: #fff;
  font-size: 18px;
  font-weight: bolder;
}
.ivu-icon-ios-cloud-upload {
  color: #fff !important;
}
</style>
