<template lang="html">
  <div class="control_manual_review">
    <div class="condition_container">
      <Date-picker
        class="condition_datePicker"
        style="display: inline-block;"
        type="daterange"
        placeholder="选择日期"
        v-model="time_range"
        confirm
        @on-ok="fetchTableDataFromServer">
      </Date-picker>
      <Select v-model="event_id"
        v-show="showEvent"
        filterable
        placeholder="事件筛选"
        clearable
        style="width:176px;"
        @on-change="fetchTableDataFromServer">
        <Option v-for="item in eventList" :value="item.value" :key="item">
          {{ item.text }}
        </Option>
      </Select>
      <Select
        v-if="false"
        v-model="verify"
        clearable
        placeholder="状态选择"
        style="width:167px;"
        @on-change="fetchTableDataFromServer">
        <Option :value="0">待校验</option>
        <Option :value="1">已校验</option>
        <Option :value="-1">所有</option>
      </Select>
      <i-button
        type="primary"
        icon="plus"
        size="small"
        @click="handleAdd">
        管控记录添加
      </i-button>
    </div>
    <el-table
      :data="tableData"
      @sort-change="handleTableSort"
      style="width:100%;text-align:left;">
      <el-table-column label="管控日期" prop="control_time" sortable></el-table-column>
      <el-table-column label="管控范围" prop="control_range"></el-table-column>
      <el-table-column label="管控内容">
        <template scope="scope">
          <el-tooltip
            class="my_tooltip"
            effect="dark"
            :content="scope.row.control_descript"
            placement="bottom"
            :openDelay="300">
            <Tag>{{ scope.row.control_descript.substring(0, 6) + '...' }}</Tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="sample_type"></el-table-column>
      <el-table-column label="数量" prop="control_number" sortable></el-table-column>
      <el-table-column label="事件" prop="event" v-if="showEvent"></el-table-column>
      <el-table-column label="状态" v-if="false">
        <template scope="scope">
          <Tag color="green" v-if="scope.row.verify">已校验</Tag>
          <Tag color="yellow" v-else>未校验</Tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <i-button type="primary" size="small" @click="handleControlDetail(scope.row)">编辑</i-button>
          <i-button type="error" size="small" @click="handleDel(scope.row)">删除</i-button>
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

    <Modal v-model="modal" style="modal_container">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>管控详情</span>
      </p>
      <div style="text-align:center">
        <Form :model="control_item" :label-width="60">
          <Form-item label="内容">
            <Input v-model="control_item.descript" type="textarea"></Input>
          </Form-item>
          <Form-item label="范围">
            <Input v-model="control_item.range"></Input>
          </Form-item>
          <Form-item label="操作">
            <Input v-model="control_item.operation"></Input>
          </Form-item>
          <Form-item label="事件">
            <Select v-model="control_item.eventId" filterable>
              <Option v-for="item in eventList" :value="item.value" :key="item">{{ item.text }}</Option>
            </Select>
          </Form-item>
          <Form-item label="样本类型">
            <Select v-model="control_item.sample_type" placeholder="请选择样本类型" filterable>
              <!-- <Option value="文本">文本</Option>
              <Option value="图片">图片</Option>
              <Option value="音频">音频</Option>
              <Option value="视频">视频</Option> -->
              <Option v-for="type in sampleTypeList" :value="type.text" :key="type.text">{{ type.text }}</Option>
            </Select>
          </Form-item>
          <Form-item label="时间">
            <Date-picker type="date" placeholder="选择日期" v-model="control_item.time"></Date-picker>
          </Form-item>
          <Form-item label="数量">
            <Input v-model="control_item.number"></Input>
          </Form-item>
        </Form>
      </div>
      <!-- <div slot="footer">
        <Button type="success" size="large" long @click="updateControlToServer">更新</Button>
      </div> -->
      <div slot="footer">
        <Button :type="control_item.check ? 'warning' : 'success'"
          size="large"
          long
          v-if="control_item.id"
          @click="updateControlToServer">
            <!-- {{control_item.check ? '取消校验' : '确认校验'}} -->
            更新
        </Button>
        <Button type="success"
          size="large"
          long
          v-else
          @click="addControlToServer">
            确认添加
        </Button>
      </div>
    </Modal>

  </div>
</template>

<script>
export default {
  data () {
    return {
      perItem: 15,
      currentPage: 1,
      totalItem: null,
      modal: false,
      sort_key: 'control_time',
      sort_order: 'desc',
      time_range: new Date(),
      event_id: null,
      verify: '',
      control_item: {
        id: '',
        descript: '',
        number: '',
        range: '',
        time: '',
        event: '',
        eventId: null,
        sample_type: '',
        operation: '',
        verify: ''
      },
      sampleTypeList: [
        { text: '信息' },
        { text: '视频' },
        { text: '图片' },
        { text: '文字样本' },
        { text: '音频' },
        { text: '跟帖' },
        { text: '文本' },
        { text: '账号' },
        { text: '网址' },
        { text: '贴文' },
        { text: '公号' },
        { text: 'qq群' },
        { text: '图文' },
        { text: '直播' },
        { text: '快照死链' },
        { text: '联想词' },
        { text: '关键词' },
        { text: '评论' },
        { text: '网站' },
        { text: '站点' }
      ],
      columns: [
        {
          title: '管控日期',
          key: 'control_time',
          sortable: true
        },
        {
          title: '管控范围',
          key: 'control_range'
        },
        {
          title: '管控内容',
          key: 'control_descript',
          render (row, column, index) {
            let desc = row[column.key].substring(0, 6) + '...'
            return `
              <Tooltip>
                <Tag>${desc}</Tag>
                <div slot="content" style="white-space: normal;">
                  ${row[column.key]}
                </div>
              </Tooltip>
            `
          }
        },
        {
          title: '类型',
          key: 'sample_type'
        },
        {
          title: '数量',
          key: 'control_number',
          sortable: true
        },
        {
          title: '事件',
          key: 'event'
        },
        {
          title: '状态',
          key: 'verify',
          render (row, column, index) {
            return `
              <Tag color="green" v-if="${row.verify}">已校验</Tag>
              <Tag color="yellow" v-else>未校验</Tag>
            `
          }
        },
        {
          title: '操作',
          key: 'action',
          render (row, column, index) {
            return `
              <i-button type="primary" size="small" @click="handleControlDetail(row)">详情</i-button>
              <i-button type="success" size="small" @click="handleVerify(row.control_id, 1)" v-if="${false}">通过</i-button>
              <i-button type="error" size="small" @click="handleDel(row)">删除</i-button>
            `
          }
        }
      ],
      tableData: [],
      eventList: [
        { value: 111, label: 'asdad' },
        { value: 222, label: 'qqq' },
        { value: 468, label: '两会' }
      ]
    }
  },
  props: {
    showEvent: {
      default: true
    },
    eventId: {
      type: Number
    }
  },
  watch: {
    eventId () {
      this.fetchTableDataFromServer()
    }
  },
  methods: {
    fetchTableDataFromServer () {
      // console.log(this.time_range)
      this.$axios.get('/control/fetchList', {
        params: {
          perItem: this.perItem,
          currentPage: this.currentPage,
          sort_key: this.sort_key,
          sort_order: this.sort_order,
          time_start: this.time_range[0],
          time_end: this.time_range[1],
          event_id: this.eventId || this.event_id,
          verify: this.verify
        }
      }).then((res) => {
        this.tableData = res.data.controlList
        this.totalItem = res.data.totalItem
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
    addControlToServer () {
      this.$axios.post('/control/add', this.control_item)
        .then((res) => {
          this.$Notice.success({
            title: '成功',
            desc: res.data.msg,
            duration: 2
          })
          this.fetchTableDataFromServer()
          this.modal = false
        }).catch((err) => {
          this.$Notice.error({
            title: '删除失败',
            desc: `失败原因: ${err}`,
            duration: 2
          })
        })
    },
    updateControlToServer () {
      this.control_item.verify = 1
      this.$axios.post('/control/updateControl', this.control_item)
        .then((res) => {
          if (res.data.success) {
            this.modal = false
            this.$Notice.success({
              title: '管控条目更新成功!'
            })
            this.fetchTableDataFromServer()
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    delControlToServer (id, cb) {
      this.$axios.post('/control/del', {id: id})
        .then((msg) => {
          cb(null, msg)
        }).catch((err) => {
          cb(err, false)
        })
    },
    verifyControlToServer (id, verify, cb) {
      this.$axios.post('/control/handleVerify',
        {
          id: id,
          verify: verify
        }
      ).then((msg) => {
        cb(null, msg)
      }).catch((err) => {
        cb(err, false)
      })
    },
    handlePageChange (currentPage) {
      this.currentPage = currentPage
      this.fetchTableDataFromServer()
    },
    handlePagesizeChange (perItem) {
      this.perItem = perItem
      this.fetchTableDataFromServer()
    },
    handleControlDetail (item) {
      this.modal = true
      this.control_item = {
        id: item.control_id,
        descript: item.control_descript,
        number: item.control_number,
        range: item.control_range,
        time: new Date(item.control_time),
        event: item.event,
        eventId: item.event_id,
        sample_type: item.sample_type,
        operation: item.control_operation
      }
    },
    handleDel (item) {
      this.$Modal.confirm({
        title: '确认删除?',
        content: '<h3 style="color: #f60;">删除此条管控记录将无法恢复</h3><p>' + item.control_descript + '</p>',
        okText: 'OK',
        cancelText: 'Cancel',
        onOk: () => {
          this.delControlToServer(item.control_id, (err, msg) => {
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
        },
        onCancel: () => {
          this.$Message.info('删除取消')
        }
      })
    },
    handleVerify (id, verify) {
      this.verifyControlToServer(id, verify, (err, msg) => {
        if (err) {
          this.$Notice.error({
            title: '系统出错。请联系管理员'
          })
        } else {
          if (verify) {
            this.$Notice.success({
              title: '审核通过成功!'
            })
          } else {
            this.$Notice.error({
              title: '审核拒绝成功!'
            })
          }
          this.fetchTableDataFromServer()
        }
      })
    },
    handleTableSort (sort) {
      console.log(sort)
      // this.sort_order = sort.order
      if (!sort.order) return
      this.sort_key = sort.prop
      if (sort.order.indexOf('desc') !== -1) {
        this.sort_order = 'desc'
      } else {
        this.sort_order = 'asc'
      }
      this.fetchTableDataFromServer()
    },
    handleAdd () {
      this.control_item = {
        id: '',
        descript: '',
        number: '',
        range: '',
        time: '',
        eventId: this.eventId || '',
        sample_type: '',
        operation: '',
        verify: 0
      }
      this.modal = true
    }
  },
  mounted () {
    this.fetchTableDataFromServer()
    this.fetchEventListFromServer()
  }
}
</script>

<style lang="scss">
.control_manual_review {
  margin-bottom: 200px;
}
.modal_container {
  .ivu-select-single {
    width: 100% !important;
  }
  .ivu-select-dropdown {
    position: absolute !important;
  }
}
.ivu-row {
  .ivu-col {
    border: 0;
    line-height: 32px;
    .ivu-select {
      width: 200px !important;
    }
  }
}
.el-tooltip__popper {
  width: 200px;
  background-color: rgba(70,76,91,.9) !important;
}
</style>
