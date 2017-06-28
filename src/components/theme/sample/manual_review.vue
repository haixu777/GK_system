<template lang="html">
  <div class="sample_manual_review">
    <div class="condition_container" v-if="showEvent">
      <Select
        v-model="event_id"
        clearable
        filterable
        placeholder="事件筛选"
        style="width:176px;"
        @on-change="fetchTableDataFromServer">
        <Option v-for="item in eventList" :value="item.value" :key="item">{{ item.text }}</Option>
      </Select>
    </div>
    <el-table
      :data="tableData"
      @sort-change="handleSortChange"
      style="width: 100%;text-align: left;margin: 0;">
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline class="sample-table-expand">
            <el-form-item label="url">
              <span>{{ props.row.url }}</span>
            </el-form-item>
            <el-form-item label="发布账号">
              <span>{{ props.row.publish_account }}</span>
            </el-form-item>
            <el-form-item label="岗位">
              <span>{{ props.row.post }}</span>
            </el-form-item>
            <el-form-item label="样本内容">
              <span>{{ props.row.sample_content }}</span>
            </el-form-item>
            <el-form-item label="文件路径" style="">
              <span>{{ props.row.sample_path }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="取证时间" prop="forensic_date" width="180" sortable></el-table-column>
      <el-table-column label="样本标题" width="180">
        <template scope="scope">
          <!-- <Tooltip>
            <Tag>{{ scope.row.sample_title.substring(0, 6) + '...' }}</Tag>
            <div slot="content" style="white-space: normal;">
              {{ scope.row.sample_title }}
            </div>
          </Tooltip> -->
          <el-tooltip
            effect="dark"
            :content="scope.row.sample_title"
            placement="bottom"
            :openDelay="300">
            <Tag>{{ scope.row.sample_title.substring(0, 6) + '...' }}</Tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="发布网站" prop="publish_platform"></el-table-column>
      <el-table-column label="发布频道" prop="publish_chanel"></el-table-column>
      <!-- <el-table-column label="样本格式" prop="sample_format"></el-table-column> -->
      <el-table-column label="事件" prop="event_name" v-if="showEvent"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <i-button type="primary" size="small" icon="hammer" @click="handleSampleDetail(scope.row)">编辑</i-button>
          <i-button type="success" icon="android-download" size="small">
            <a :href="'http://'+ localUrl +':3000/sample/download?id='+scope.row.id" style="color:#fff;" download>下载</a>
          </i-button>
          <i-button type="error" size="small" icon="ios-trash" @click="handleDel(scope.row)">删除</i-button>
        </template>
      </el-table-column>
    </el-table>

    <Page
      style="float: right;"
      :total="totalItem"
      :current="currentPage"
      :page-size="perItem"
      :page-size-opts="[10, 15, 30, 50]"
      @on-change="handlePageChange"
      @on-page-size-change="handlePagesizeChange"
      show-total
      size="small"
      show-sizer>
    </Page>

    <Modal v-model="modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>样本详情</span>
      </p>
      <div style="text-align:center">
        <Form :model="sampleItem" :label-width="60">
          <Form-item label="发布账号">
            <Input v-model="sampleItem.publish_account"></Input>
          </Form-item>
          <Form-item label="发布平台">
            <Input v-model="sampleItem.publish_platform"></Input>
          </Form-item>
          <Form-item label="发布频道">
            <Input v-model="sampleItem.publish_chanel"></Input>
          </Form-item>
          <Form-item label="发布时间">
            <Date-picker type="date" placeholder="选择日期" v-model="sampleItem.publish_time"></Date-picker>
          </Form-item>
          <Form-item label="所属事件">
            <Select v-model="sampleItem.event_id" class="modal_select" style="width:200px" filterable>
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
            <Input v-model="sampleItem.post"></Input>
          </Form-item>
          <Form-item label="取证时间">
            <Date-picker type="date" placeholder="选择日期" v-model="sampleItem.forensic_date"></Date-picker>
          </Form-item>
          <Form-item label="样本格式">
            <!-- <Input v-model="sampleItem.sample_format"></Input> -->
            <Radio-group v-model="sampleItem.sample_format">
              <Radio label="文本"></Radio>
              <Radio label="视频"></Radio>
              <Radio label="网页"></Radio>
              <Radio label="word"></Radio>
              <Radio label="excel"></Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="样本标题">
            <Input v-model="sampleItem.sample_title"></Input>
          </Form-item>
          <Form-item label="样本内容">
            <Input v-model="sampleItem.sample_content" type="textarea"></Input>
          </Form-item>
          <!-- <Form-item label="样本路径">
            <Input v-model="sampleItem.sample_path"></Input>
          </Form-item> -->
          <Form-item label="url">
            <Input v-model="sampleItem.url"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" long @click="updateSampleToServer">更新</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      perItem: 15,
      currentPage: 1,
      sort_key: 'forensic_date',
      sort_order: 'desc',
      totalItem: null,
      modal: false,
      eventList: [],
      event_id: null,
      sampleItem: {
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
        url: ''
      },
      localUrl: ''
    }
  },
  props: {
    eventId: {
      type: Number
    },
    showEvent: {
      default: true
    }
  },
  watch: {
    eventId () {
      this.fetchTableDataFromServer()
    }
  },
  methods: {
    fetchTableDataFromServer () {
      this.$axios.get('/sample/fetchList', {
        params: {
          currentPage: this.currentPage,
          perItem: this.perItem,
          sort_key: this.sort_key,
          sort_order: this.sort_order,
          eventId: this.eventId || this.event_id
        }
      }).then((res) => {
        if (res.data.success) {
          this.tableData = res.data.data.sampleList
          this.totalItem = res.data.data.totalItem
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    fetchEventListFromServer () {
      this.$axios.get('/control/fetchEventListForControl')
        .then((res) => {
          this.eventList = res.data.eventsList
        })
    },
    updateSampleToServer () {
      this.$axios.post('/sample/update', this.sampleItem)
        .then((res) => {
          if (res.data.success) {
            this.modal = false
            this.$Notice.success({
              title: '样本信息更新成功!'
            })
            this.fetchTableDataFromServer()
          }
        }).catch((err) => {
          console.log(err)
        })
      console.log(this.sampleItem)
    },
    delSampleToServer (item, cb) {
      this.$axios.post('/sample/del', {id: item.id, path: item.sample_path})
        .then((msg) => {
          cb(null, msg)
        }).catch((err) => {
          cb(err, false)
        })
    },
    handleSortChange (item) {
      this.sort_key = item.prop
      this.sort_order = (item.order.indexOf('desc') !== -1) ? 'desc' : 'asc'
      this.fetchTableDataFromServer()
    },
    handleSampleDetail (item) {
      this.sampleItem = {
        id: item.id,
        event_name: item.event_name,
        event_id: item.event_id,
        forensic_date: new Date(item.forensic_date),
        post: item.post,
        publish_account: item.publish_account,
        publish_chanel: item.publish_chanel,
        publish_platform: item.publish_platform,
        publish_time: new Date(item.publish_time),
        sample_content: item.sample_content,
        sample_format: item.sample_format,
        sample_path: item.sample_path,
        sample_title: item.sample_title,
        url: item.url
      }
      this.modal = true
    },
    handleDel (item) {
      this.$Modal.confirm({
        title: '确认删除?',
        content: '<h3 style="color: #f60;">删除此条样本记录将无法恢复</h3><p>' + item.sample_title + '</p>',
        okText: 'OK',
        cancelText: 'Cancel',
        onOk: () => {
          this.delSampleToServer(item, (err, msg) => {
            if (err) {
              this.$Notice.error({
                title: '删除失败',
                desc: `失败原因: ${err}`,
                duration: 2
              })
            } else {
              this.$Notice.success({
                title: '删除成功',
                desc: msg.msg,
                duration: 2
              })
              this.fetchTableDataFromServer()
            }
          })
        }
      })
    },
    handlePageChange (page) {
      this.currentPage = page
      this.fetchTableDataFromServer()
    },
    handlePagesizeChange (pageSize) {
      this.perItem = pageSize
      this.fetchTableDataFromServer()
    },
    handleDownload (id) {
      this.$axios.get('/sample/download', {
        params: {
          id: id
        }
      }).then((res) => {
        console.log(res)
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
    this.fetchTableDataFromServer()
    this.fetchEventListFromServer()
    this.handleLocalUrl()
  }
}
</script>

<style lang="scss">
.sample-table-expand {
  text-align: left;
  font-size: 0;
}
.sample-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.sample-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.sample_manual_review {
  .el-form-item__content {
    width: 81%;
  }
}
.modal_select.ivu-select-single {
  width: 100% !important;
}
.ivu-select-dropdown {
  position: absolute !important;
}
.ivu-form-item-content {
  text-align: left;
}
.el-table-filter__checkbox-group {
  max-height: 300px;
  overflow: auto;
}
.el-checkbox+.el-checkbox {
  margin-left: 5px;
}
.ivu-col {
  text-align: center;
  line-height: 30px;
  height: 30px;
  // border: 1px solid #eee;
}
.el-tooltip__popper {
  width: 200px;
  background-color: rgba(70,76,91,.9) !important;
}
</style>
