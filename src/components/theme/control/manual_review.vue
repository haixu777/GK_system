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
        style="width:300px;"
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
        class="right"
        @click="handleAdd">
        管控记录添加
      </i-button>
    </div>
    <el-table
      stripe
      border
      :data="tableData"
      @sort-change="handleTableSort"
      style="width:100%;text-align:left;">
      <el-table-column label="序号" type="index" width="70"></el-table-column>
      <el-table-column label="管控日期" prop="control_time" width="130" sortable></el-table-column>
      <el-table-column label="操作" prop="control_operation" width="90" sortable></el-table-column>
      <!-- <el-table-column label="管控内容">
        <template scope="scope">
          <el-tooltip
            class="my_tooltip"
            effect="dark"
            :content="scope.row.control_descript ? scope.row.control_descript : '无内容'"
            placement="bottom"
            :openDelay="300">
            <Tag>{{ scope.row.control_descript ? scope.row.control_descript.substring(0, 6) + '...' : '无内容' }}</Tag>
          </el-tooltip>
        </template>
      </el-table-column> -->
      <el-table-column label="管控内容" prop="control_descript"></el-table-column>
      <el-table-column label="管控范围" prop="control_range" width="130"></el-table-column>
      <el-table-column label="类型" prop="sample_type" width="100"></el-table-column>
      <el-table-column label="数量" prop="control_number" width="90" sortable></el-table-column>
      <el-table-column label="事件" prop="event" v-if="showEvent" width="180"></el-table-column>
      <el-table-column label="状态" v-if="false">
        <template slot-scope="scope">
          <Tag color="green" v-if="scope.row.verify">已校验</Tag>
          <Tag color="yellow" v-else>未校验</Tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
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

    <Modal v-model="modal" style="modal_container" width="800">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>管控详情</span>
      </p>
      <div style="text-align:center">
        <Form ref="control_item" :model="control_item" :label-width="90" :rules="ruleValidate">
          <!-- <Form-item label="文本处理区">
            <Input v-model="control_text" type="textarea"></Input>
            <i-button type="primary" size="small" @click="controlTextExtra" :loading="extraLoading">抽取</i-button>
          </Form-item> -->
          <Form-item label="内容" prop="descript">
            <Input v-model="control_item.descript" :rows="4" type="textarea"></Input>
          </Form-item>
          <Form-item label="范围" prop="range">
            <Input v-model="control_item.range"></Input>
          </Form-item>
          <Form-item label="操作" prop="operation">
            <Input v-model="control_item.operation"></Input>
          </Form-item>
          <Form-item label="数量" prop="number">
            <Input v-model="control_item.number" :number="true"></Input>
          </Form-item>
          <Form-item label="事件" prop="">
            <Select v-model="control_item.eventId" filterable>
              <Option v-for="item in eventList" :value="item.value" :key="item">{{ item.text }}</Option>
            </Select>
          </Form-item>
          <Form-item label="样本类型" prop="">
            <Select v-model="control_item.sample_type" placeholder="请选择样本类型" filterable>
              <!-- <Option value="文本">文本</Option>
              <Option value="图片">图片</Option>
              <Option value="音频">音频</Option>
              <Option value="视频">视频</Option> -->
              <Option v-for="type in sampleTypeList" :value="type.text" :key="type.text">{{ type.text }}</Option>
            </Select>
          </Form-item>
          <Form-item label="时间" prop="">
            <Date-picker type="date" placeholder="选择日期" v-model="control_item.time"></Date-picker>
          </Form-item>
          <!-- <Form-item label="数量">
            <Input v-model="control_item.number"></Input>
          </Form-item> -->
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
          @click="submitAdd('control_item')">
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
      extraLoading: false,
      control_text: '',
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
      ruleValidate: {
        _eventId: [
          { required: true, message: '请选择事件', trigger: 'blur' }
        ],
        descript: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        range: [
          { required: true, message: '范围不能为空', trigger: 'blur' }
        ],
        operation: [
          { required: true, message: '操作不能为空', trigger: 'blur' }
        ],
        sample_type: [
          { required: true, message: '样本类型不能为空', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '时间不能为空', trigger: 'change' }
        ]
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
      tableData: [
        {
          control_descript: '加载中...',
          // control_id: 31264,
          control_number: '1',
          control_operation: '加载中...',
          control_range: '加载中...',
          control_time: '加载中...',
          event: '加载中...',
          event_id: null,
          sample_type: '加载中...',
          verify: 0
        }
      ],
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
      if (Number(this.control_item.number)) {
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
      } else {
        this.$Message.error('请输入正确数量')
      }
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
    controlTextExtra () {
      this.extraLoading = true
      this.$axios.post('http://10.136.88.96:8080/api/res/tic', {text: this.control_text})
        .then((res) => {
          if (!res.data.length) {
            this.$Message.error('抽取失败，文本内无匹配项')
          } else {
            this.$Message.success('抽取完成')
            this.control_item.number = res.data[0].num
            this.control_item.sample_type = res.data[0].type.replace(/(^\s+)|(\s+$)/g, '').split(' ')[0]
            this.control_item.range = res.data[0].GKarea.split(' ')[0]
            this.control_item.descript = res.data[0].content
            this.control_item.operation = res.data[0].operation.split(' ')[0]
          }
          this.extraLoading = false
        }).catch((err) => {
          console.log(err)
          this.extraLoading = false
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
        number: 1,
        range: '',
        time: new Date(),
        eventId: this.eventId || '',
        sample_type: '',
        operation: '',
        verify: 0
      }
      this.modal = true
    },
    submitAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (!this.control_item.eventId || !this.control_item.time || !this.control_item.sample_type) {
            this.$Message.error('请输入完整信息')
          } else {
            this.addControlToServer()
          }
        } else {
          this.$Message.error('请输入完整信息')
        }
      })
      /*
      if (this.control_item.eventId) {
        this.addControlToServer()
      } else {
        this.$refs[name].validate((valid) => {})
        this.$Message.error('请输入完整信息')
      }
      */
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
.right {
  float: right;
}
</style>
