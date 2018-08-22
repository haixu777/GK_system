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
      <Date-picker
        v-model="time_range"
        type="daterange"
        :options="time_options"
        confirm
        placement="bottom-start"
        placeholder="选择取证日期"
        style="width:176px;display:inline-block;"
        @on-clear="handleClearTimeRange"
        @on-ok="fetchTableDataFromServer">
      </Date-picker>
      <!-- <Select
        v-model="sample_format"
        clearable
        filterable
        placeholder="格式筛选"
        style="width:176px;"
        @on-change="fetchTableDataFromServer">
        <Option value="图片">图片</Option>
        <Option value="音频">音频</Option>
        <Option value="视频">视频</Option>
        <Option value="html">html</Option>
        <Option value="pdf">pdf</Option>
      </Select> -->
      <!-- <Select
       v-model="hasKeyword"
       clearable
       placeholder="关键词配置"
       style="width:176px;"
       @on-change="fetchTableDataFromServer">
       <Option value="0">未配置 - 关键词</Option>
       <Option value="1">已配置 - 关键词</Option>
      </Select> -->
      <!-- <Select
        v-if="false"
        v-model="user_id"
        clearable
        filterable
        placeholder="操作人筛选"
        style="width:176px;"
        @on-change="fetchTableDataFromServer">
        <Option v-for="item in userList" :value="item.value" :key="item">{{ item.text }}</Option>
      </Select> -->
      <!-- <Select
        v-model="hasPlatform"
        clearable
        filterable
        placeholder="平台配置"
        style="width:176px;"
        @on-change="fetchTableDataFromServer">
        <Option value="0">未配置 - 平台</Option>
        <Option value="1">已配置 - 平台</Option>
      </Select> -->
      <!-- <Select
        v-model="hasContent"
        clearable
        filterable
        placeholder="内容配置"
        style="width:176px;"
        @on-change="fetchTableDataFromServer">
        <Option value="0">未配置 - 内容</Option>
        <Option value="1">已配置 - 内容</Option>
      </Select> -->
    </div>
    <el-table
      :data="tableData"
      border
      stripe
      @sort-change="handleSortChange"
      style="width: 100%;text-align: left;margin: 0;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="sample-table-expand">
            <!-- <el-form-item label="发布网站">
              <span>{{ props.row.publish_platform }}</span>
            </el-form-item> -->
            <el-form-item label="发布频道">
              <span>{{ props.row.publish_chanel }}</span>
            </el-form-item>
            <el-form-item label="url">
              <span>{{ props.row.url }}</span>
            </el-form-item>
            <el-form-item label="发布账号">
              <span>{{ props.row.publish_account }}</span>
            </el-form-item>
            <el-form-item label="岗位">
              <span>{{ props.row.post }}</span>
            </el-form-item>
            <el-form-item label="文件路径" style="">
              <span>{{ props.row.sample_path }}</span>
            </el-form-item>
            <el-form-item label="样本内容" class="full">
              <span>{{ props.row.sample_content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" width="70" label="序号"></el-table-column>
      <el-table-column label="取证时间" prop="forensic_date" width="130" sortable></el-table-column>
      <!-- <el-table-column label="发布网站" prop="publish_platform" width="130"></el-table-column> -->
      <!-- <el-table-column label="发布频道" prop="publish_chanel" width="130"></el-table-column> -->
      <el-table-column label="样本标题" prop="sample_title"></el-table-column>
      <!-- <el-table-column label="样本标题" width="130">
        <template scope="scope">
          <el-tooltip
            effect="dark"
            :content="scope.row.sample_title"
            placement="bottom"
            :openDelay="300">
            <Tag>{{ scope.row.sample_title.substring(0, 6) + '...' }}</Tag>
          </el-tooltip>
        </template>
      </el-table-column> -->
      <el-table-column label="事件" prop="event_name" v-if="showEvent" width="200"></el-table-column>
      <el-table-column label="平台" prop="publish_platform" v-if="showEvent" width="200"></el-table-column>
      <el-table-column label="样本格式" prop="sample_format" width="100"></el-table-column>
      <el-table-column label="关键词" prop="keyword">
        <template slot-scope="scope">
          <Tag v-for="item in handleKeyword(scope.row.keyword)" :key="item">{{ item }}</Tag>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="update_time" width="130" sortable></el-table-column>
      <!-- <el-table-column label="操作人" prop="operator" width="130"></el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i-button type="primary" size="small" icon="hammer" @click="handleSampleDetail(scope.row)">编辑</i-button>
          <a class="download_btn ivu-btn ivu-btn-success ivu-btn-small" :href="localUrl +'/sample/download?id='+scope.row.id" style="color:#fff;" download>下载</a>
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
      show-elevator
      size="small"
      show-sizer>
    </Page>

    <Modal v-model="modal" width="600">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>样本详情</span>
      </p>
      <div style="text-align:center">
        <Form :model="sampleItem" :label-width="80">
          <Form-item label="样本内容">
            <Input v-model="sampleItem.sample_content" :rows="5" type="textarea"></Input>
          </Form-item>
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
              <Radio label="图片"></Radio>
              <Radio label="音频"></Radio>
              <Radio label="视频"></Radio>
              <Radio label="html"></Radio>
              <Radio label="pdf"></Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="样本标题">
            <Input v-model="sampleItem.sample_title"></Input>
          </Form-item>
          <!-- <Form-item label="样本路径">
            <Input v-model="sampleItem.sample_path"></Input>
          </Form-item> -->
          <Form-item label="关键词">
            <Input v-model="sampleItem.keyword" placeholder="关键词以空格分割"></Input>
          </Form-item>
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
const $utils = require('utils')
export default {
  data () {
    return {
      tableData: [
        {
          forensic_date: '加载中...',
          sample_title: '加载中...',
          event_name: '加载中...',
          publish_platform: '加载中...',
          sample_format: '加载中...',
          update_time: '加载中...',
          operator: '加载中...',
          keyword: null
        }
      ],
      perItem: 15,
      currentPage: 1,
      sort_key: 'forensic_date',
      sort_order: 'desc',
      totalItem: null,
      modal: false,
      eventList: [],
      event_id: null,
      sample_format: '',
      hasKeyword: '',
      hasPlatform: '',
      hasContent: '',
      userList: [],
      user_id: null,
      time_range: [],
      time_options: {
        shortcuts: [
          {
            text: '最近一周',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            }
          },
          {
            text: '最近一个月',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            }
          },
          {
            text: '最近三个月',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            }
          }
        ]
      },
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
        keyword: '',
        url: '',
        user_id: $utils.Cookie.get('userId'),
        operator: this.$store.state.userName
      },
      localUrl: process.env.URL
    }
  },
  props: {
    eventId: {
      type: Number
    },
    showEvent: {
      default: true
    },
    showKeyword: {
      default: 0
    }
  },
  watch: {
    eventId () {
      this.fetchTableDataFromServer()
    }
  },
  methods: {
    fetchTableDataFromServer () {
      console.log(this.hasPlatform)
      this.$axios.get('/sample/fetchList', {
        params: {
          currentPage: this.currentPage,
          perItem: this.perItem,
          sort_key: this.sort_key,
          sort_order: this.sort_order,
          eventId: this.eventId || this.event_id,
          sample_format: this.showEvent ? this.sample_format : '',
          hasKeyword: this.showEvent ? (this.showKeyword || this.hasKeyword) : '',
          hasPlatform: this.showEvent ? (this.hasPlatform) : '',
          hasContent: this.showEvent ? (this.hasContent) : '',
          user_id: this.user_id,
          time_start: this.time_range[0],
          time_end: this.time_range[1]
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
    fetchUserListFromServer () {
      this.$axios.get('/user/list')
        .then((res) => {
          this.userList = res.data.userList
        }).catch((err) => {
          console.log(err)
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
    handleClearTimeRange () {
      this.time_range = []
      this.fetchTableDataFromServer()
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
        keyword: item.keyword,
        url: item.url,
        user_id: $utils.Cookie.get('userId'),
        operator: this.$store.state.userName
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
    handleKeyword (str) {
      return str ? str.split(' ') : null
    }
  },
  mounted () {
    this.fetchTableDataFromServer()
    this.fetchEventListFromServer()
    this.fetchUserListFromServer()
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
.sample-table-expand {
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .full {
    width: 100%;
  }
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
.download_btn {
  color: #fff;
  background-color: #19be6b;
  border-color: #19be6b;
  padding: 2px 7px;
  font-size: 12px;
  border-radius: 3px;
}
</style>
