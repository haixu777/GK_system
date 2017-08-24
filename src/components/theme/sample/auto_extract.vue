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
              <a :href="localUrl + '/sample/autoDownload?id='+scope.row.id" style="color:#fff;" download>下载</a>
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
          :action="localUrl +'/sample/upload'">
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
      <div style="text-align:center" v-if="false">
        <Form :model="extra_item" :label-width="60">
          <Form-item label="岗位">
            <Input v-model="extra_item.post"></Input>
          </Form-item>
          <Form-item label="url">
            <Input v-model="extra_item.url"></Input>
          </Form-item>
          <Form-item label="发布平台">
            <Input v-model="extra_item.platform"></Input>
          </Form-item>
          <Form-item label="发布频道">
            <Input v-model="extra_item.chanel"></Input>
          </Form-item>
          <Form-item label="发布时间">
            <Date-picker type="date" placeholder="选择日期" style="" v-model="extra_item.publish_time"></Date-picker>
          </Form-item>
          <Form-item label="发布账号">
            <Input v-model="extra_item.publish_account"></Input>
          </Form-item>
          <Form-item label="样本标题">
            <Input v-model="extra_item.title"></Input>
          </Form-item>
          <Form-item label="样本内容">
            <Input v-model="extra_item.content"></Input>
          </Form-item>
          <Form-item label="所属事件">
            <Select v-model="extra_item.eventId"
              filterable
              placeholder="事件筛选"
              clearable>
              <Option v-for="item in eventList" :value="item.value" :key="item">
                {{ item.text }}
              </Option>
            </Select>
          </Form-item>
        </Form>
      </div>
      <div style="text-align:center">
        <Form ref="extra_item" :model="extra_item" :label-width="60" :rules="formValidate">
          <Form-item label="发布账号">
            <Input v-model="extra_item.publish_account"></Input>
          </Form-item>
          <Form-item label="发布平台">
            <Input v-model="extra_item.publish_platform"></Input>
          </Form-item>
          <Form-item label="发布频道">
            <Input v-model="extra_item.publish_chanel"></Input>
          </Form-item>
          <Form-item label="发布时间">
            <Date-picker type="date" placeholder="选择日期" v-model="extra_item.publish_time"></Date-picker>
          </Form-item>
          <Form-item label="所属事件" prop="event_id">
            <Select v-model="extra_item.event_id" class="modal_select" filterable>
              <Option v-for="item in eventList" :value="item.value" :key="item">{{ item.text }}</Option>
            </Select>
          </Form-item>
          <!--
          <Form-item label="样本类型">
            <Select v-model="control_item.sample_type" placeholder="请选择样本类型">
              <Option value="文本">文本</Option>
              <Option value="视频">视频</Option>
            </Select>
          </Form-item> -->
          <Form-item label="岗位">
            <Input v-model="extra_item.post"></Input>
          </Form-item>
          <Form-item label="取证时间">
            <Date-picker type="date" placeholder="选择日期" v-model="extra_item.forensic_date"></Date-picker>
          </Form-item>
          <Form-item label="样本格式">
            <!-- <Input v-model="sampleItem.sample_format"></Input> -->
            <Radio-group v-model="extra_item.sample_format">
              <Radio label="图片"></Radio>
              <Radio label="音频"></Radio>
              <Radio label="视频"></Radio>
              <Radio label="html"></Radio>
              <Radio label="pdf"></Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="样本标题">
            <Input v-model="extra_item.sample_title"></Input>
          </Form-item>
          <Form-item label="样本内容">
            <Input v-model="extra_item.sample_content" type="textarea"></Input>
          </Form-item>
          <!-- <Form-item label="样本路径">
            <Input v-model="sampleItem.sample_path"></Input>
          </Form-item> -->
          <Form-item label="关键词">
            <Input v-model="extra_item.keyword" placeholder="关键词以空格分割"></Input>
          </Form-item>
          <Form-item label="url">
            <Input v-model="extra_item.url"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" long @click="submitAdd('extra_item')" :loading="!extra_done">
          {{ extra_done ? '抽取完成' : '抽取中' }}
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
const $utils = require('utils')
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
      extra_done: false,
      upload_modal: false,
      extra_modal: false,
      fileList: [],
      eventList: [],
      extra_item: {
        id: null,
        event_name: '',
        event_id: null,
        forensic_date: '',
        post: '',
        publish_account: '',
        publish_chanel: '',
        publish_platform: '',
        publish_time: '',
        sample_content: '',
        sample_format: '',
        sample_path: '',
        sample_title: '',
        keyword: '',
        url: '',
        user_id: $utils.Cookie.get('userId'),
        operator: this.$store.state.userName
      },
      localUrl: process.env.URL,
      formValidate: {
        event_id: [
          { required: true, message: '请选择事件', trigger: 'blur' }
        ]
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
    autoExtraByServer (sampleId) {
      this.extra_item.sample_content = ''
      this.extra_done = false
      this.$axios.post('/sample/handleExtra', {
        id: sampleId
      }).then((res) => {
        if (res.data.success) {
          if (res.data.text.indexOf('extraList') !== -1) {
            let resObj = JSON.parse(res.data.text)
            resObj.extraList.forEach((item) => {
              this.extra_item.sample_content += item.content
            })
          } else {
            this.extra_item.sample_content = res.data.text
          }
        }
        this.extra_done = true
      }).catch((err) => {
        console.log(err)
        this.extra_done = true
      })
    },
    fetchEventListFromServer () {
      this.$axios.get('/control/fetchEventListForControl')
        .then((res) => {
          this.eventList = res.data.eventsList
        })
    },
    submitExtra () {
      this.$axios.post('/sample/extra', this.extra_item)
        .then((res) => {
          let msg = res.data.info.split(',')
          this.$Notice.success({
            title: msg[1],
            desc: msg[0]
          })
          this.extra_modal = false
          this.fetchTableDataFromServer()
        }).catch((err) => {
          console.log(err)
        })
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
      this.extra_modal = true
      this.extra_item.sampleId = sample.id
      this.extra_item.sample_title = sample.name
      this.extra_item.sample_path = sample.path
      this.extra_item.forensic_date = sample.upload_date
      this.extra_item.publish_time = new Date()
      this.autoExtraByServer(sample.id)
      this.fetchEventListFromServer()
    },
    multipleExtra (data) {
      console.log(data)
    },
    beforeUpload (file) {
      return this.checkIsExistFromServer(file.name)
    },
    submitAdd (name) {
      if (this.extra_item.event_id) {
        this.submitExtra()
      } else {
        this.$refs[name].validate((valid) => {})
        this.$Message.error('请输入完整信息')
      }
    }
  },
  mounted () {
    this.fetchTableDataFromServer()
  }
}
</script>

<style lang="css">
</style>
