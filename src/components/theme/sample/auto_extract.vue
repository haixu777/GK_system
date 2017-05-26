<template lang="html">
  <div class="sample_auto_container">
    <!-- <Upload
      style="display: inline-block;"
      multiple
      action="//localhost:3000/sample/upload"
      @on-success="handleUploadSuccess">
      <Button type="ghost" icon="ios-cloud-upload-outline" size="small">上传文件</Button>
    </Upload> -->
    <Button type="ghost" icon="ios-cloud-upload-outline" size="small" @click="handleUpload">上传文件</Button>
    <i-button type="primary" icon="settings" size="small">批量抽取</i-button>
    <el-table
      :data="tableData"
      style="width: 100%;text-align: left;margin: 0;"
      @sort-change="handleSortChange">
        <el-table-column label="上传时间" prop="upload_date" sortable></el-table-column>
        <el-table-column label="文件名" prop="name"></el-table-column>
        <el-table-column label="文件路径" prop="path"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <i-button type="primary" size="small" icon="hammer" @click="handleSampleDetail(scope.row)">抽取</i-button>
            <i-button type="error" size="small" icon="ios-trash" @click="handleDel(scope.row)">删除</i-button>
          </template>
        </el-table-column>
    </el-table>

    <Page
      style="float: right;"
      :total="totalItem"
      :current="fetchCondition.currentPage"
      :page-size="fetchCondition.perItem"
      :page-size-opts="[10, 15, 30, 50]"
      @on-change="handlePageChange"
      @on-page-size-change="handlePagesizeChange"
      show-total
      size="small"
      show-sizer>
    </Page>

    <Modal v-model="upload_modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>文件上传</span>
      </p>
      <div style="text-align:center">
        <!-- <el-upload
          drag
          action="//localhost:3000/sample/upload"
          :auto-upload="false"
          :on-success="fetchTableDataFromServer"
          :mutiple="true">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload> -->
        <Upload
          multiple
          type="drag"
          :before-upload="beforeUpload"
          :on-error="handleUploadError"
          :on-success="handleUploadSuccess"
          action="//localhost:3000/sample/upload">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或将文件拖拽到这里上传</p>
          </div>
        </Upload>
      </div>
      <div slot="footer">
        <!-- <Button type="success" size="large" long @click="submitUpload">上传到服务器</Button> -->
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      totalItem: null,
      fetchCondition: {
        perItem: 15,
        currentPage: 1,
        sort_key: 'upload_date',
        sort_order: 'desc'
      },
      upload_modal: false,
      fileList: []
    }
  },
  methods: {
    fetchTableDataFromServer () {
      this.$axios.get('/sample/fetchAutoList', {
        params: this.fetchCondition
      }).then((res) => {
        this.tableData = res.data.data.sampleAutoList
        this.totalItem = res.data.data.totalItem
      }).catch((res) => {
        console.log(res)
      })
    },
    checkIsExistFromServer (filename) {
      return new Promise((resolve, reject) => {
        this.$axios.get('/sample/autoIsExist', {
          params: {
            name: filename
          }
        }).then((res) => {
          if (res.data.isExist) {
            reject()
            this.$Notice.error({
              title: `上传失败`,
              desc: `样本: ${filename}，已存在，请勿重复上传`
            })
          } else {
            resolve()
          }
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    handleSortChange (item) {
      this.fetchCondition.sort_key = item.prop
      this.fetchCondition.sort_order = (item.order.indexOf('desc') !== -1) ? 'desc' : 'asc'
      this.fetchTableDataFromServer()
    },
    handlePageChange (page) {
      this.fetchCondition.currentPage = page
      this.fetchTableDataFromServer()
    },
    handlePagesizeChange (pageSize) {
      this.fetchCondition.perItem = pageSize
      this.fetchTableDataFromServer()
    },
    handleUpload () {
      this.upload_modal = true
    },
    handleUploadSuccess (response, file, fileList) {
      this.$Notice.success({
        title: '文件样本添加成功!',
        desc: response.msg
      })
      this.fetchTableDataFromServer()
    },
    handleUploadError (error, file, fileList) {
      console.log(error)
      console.log(file)
    },
    multipleExtra (data) {
      console.log(data)
    },
    beforeUpload (file) {
      return this.checkIsExistFromServer(file.name)
    }
  },
  mounted () {
    this.fetchTableDataFromServer()
  }
}
</script>

<style lang="css">
</style>
