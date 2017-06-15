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
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="上传时间" prop="upload_date" sortable></el-table-column>
        <el-table-column label="文件名" prop="name"></el-table-column>
        <el-table-column label="文件路径" prop="path"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <i-button type="primary" size="small" icon="hammer" @click="handleSampleExtra(scope.row)">抽取</i-button>
            <i-button type="success" size="small" icon="android-download">
              <a :href="'http://localhost:3000/sample/autoDownload?id='+scope.row.id" style="color:#fff;">下载</a>
            </i-button>
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

    <Modal v-model="extra_modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>抽取确认</span>
      </p>
      <div style="text-align:center">
        <Form :model="extra_item" :label-width="60">
          <Form-item label="文件名">
            <Input v-model="extra_item.post"></Input>
          </Form-item>
          <Form-item label="文件路径">
            <Input v-model="extra_item.url"></Input>
          </Form-item>
          <Form-item label="发布平台">
            <Input v-model="extra_item.platform"></Input>
          </Form-item>
          <Form-item label="发布频道">
            <Input v-model="extra_item.chanel"></Input>
          </Form-item>
          <Form-item label="发布事件">
            <Input v-model="extra_item.time"></Input>
          </Form-item>
        </Form>
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
      extra_modal: false,
      fileList: [],
      extra_item: {
        filename: '',
        path: ''
      }
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
      if (filename.indexOf(' ') !== -1) {
        return new Promise((resolve, reject) => {
          reject()
          this.$Notice.error({
            title: `上传失败`,
            desc: `样本: ${filename}，文件名内不能有空格存在`
          })
        })
      } else {
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
      }
    },
    delSampleFromServer (reqObj, cb) {
      this.$axios.post('/sample/autoDel', reqObj)
        .then((res) => {
          cb(null, res.data.msg)
        }).catch((err) => {
          cb(err, false)
        })
    },
    handleDel (sample) {
      this.$Modal.confirm({
        title: '确认删除?',
        content: `${sample.name}`,
        loading: true,
        onOk: () => {
          this.delSampleFromServer({ id: sample.id, path: sample.path }, (err, msg) => {
            if (err) {
              this.$Notice.error({
                title: '删除失败',
                desc: `${sample.name}`
              })
            } else {
              this.$Notice.success({
                title: '删除成功',
                desc: `${sample.name}`
              })
              this.fetchTableDataFromServer()
            }
            this.$Modal.remove()
          })
        },
        onCancel: () => {
          this.$Message.info('删除取消')
        }
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
    handleSelectionChange (selection) {
      console.log(selection)
    },
    handleSampleExtra (sample) {
      console.log(sample)
      this.extra_modal = true
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
