<template lang="html">
  <div class="auto_extract_container">
    <Radio-group v-model="check" type="button" @on-change="handleCheck" size="small" v-if="false">
      <Radio label="0">未校验</Radio>
      <Radio label="1">已校验</Radio>
    </Radio-group>
    <Table
      :columns="columns"
      :data="tableData"
      @on-sort-change="handleTableSort">
    </Table>

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
          <Form-item label="事件">
            <Select v-model="control_item.eventId" style="width:200px" filterable>
              <Option v-for="item in eventList" :value="item.value" :key="item">{{ item.text }}</Option>
            </Select>
          </Form-item>
          <Form-item label="样本类型">
            <Select v-model="control_item.sample_type" placeholder="请选择样本类型">
              <Option value="文本">文本</Option>
              <Option value="图片">图片</Option>
              <Option value="音频">音频</Option>
              <Option value="视频">视频</Option>
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
      <div slot="footer">
        <Button :type="control_item.check ? 'warning' : 'success'"
          size="large"
          long
          @click="confirmCheck">
            {{control_item.check ? '取消校验' : '确认校验'}}
        </Button>
      </div>
    </Modal>

  </div>
</template>

<script>
export default {
  data () {
    return {
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
          title: '操作',
          key: 'action',
          render (row, column, index) {
            return `
              <i-button type="primary" size="small" @click="handleControlDetail(row)">查看</i-button>
              <i-button type="error" size="small" @click="handleDel(row)" v-if="${!(row.check)}">删除</i-button>
            `
          }
        }
      ],
      tableData: [],
      perItem: 15,
      currentPage: 1,
      totalItem: null,
      check: 0,
      sort_key: 'control_time',
      sort_order: 'desc',
      modal: false,
      control_item: {
        id: '',
        descript: '',
        number: '',
        range: '',
        time: '',
        event: '',
        sample_type: ''
      },
      eventList: []
    }
  },
  methods: {
    fetchTableDataFromServer () {
      this.$axios.get('/control/fetchAutoList', {
        params: {
          perItem: this.perItem,
          currentPage: this.currentPage,
          sort_key: this.sort_key,
          sort_order: this.sort_order
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
    delAutoControlToServer (id, cb) {
      this.$axios.post('/control/delAuto', {id: id})
        .then((msg) => {
          cb(null, msg)
        }).catch((err) => {
          cb(err, false)
        })
    },
    confirmCheck () {
      this.$axios.post('/control/confirmCheck',
        {
          auto_id: this.control_item.id,
          check: this.control_item.check === false ? 1 : 0,
          descript: this.control_item.descript,
          number: this.control_item.number,
          range: this.control_item.range,
          time: new Date(this.control_item.time),
          event: this.control_item.event,
          eventId: this.control_item.eventId,
          sample_type: this.control_item.sample_type
        }).then((res) => {
          if (res.data.success) {
            this.modal = false
            this.$Notice.success({
              title: '校验成功!'
            })
            this.fetchTableDataFromServer()
          }
        }).catch((err) => {
          console.log(err)
        })
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
        sample_type: item.sample_type
      }
    },
    handleTableSort (sort) {
      console.log(sort)
      this.sort_key = sort.key
      this.sort_order = sort.order
      this.fetchTableDataFromServer()
    },
    handlePageChange (currentPage) {
      this.currentPage = currentPage
      this.fetchTableDataFromServer()
    },
    handlePagesizeChange (perItem) {
      this.perItem = perItem
      this.fetchTableDataFromServer()
    },
    handleCheck (val) {
      this.check = val
      this.fetchTableDataFromServer()
    },
    handleDel (item) {
      this.$Modal.confirm({
        title: '确认删除?',
        content: '<h3 style="color: #f60;">删除此条管控记录将无法恢复</h3><p>' + item.control_descript + '</p>',
        okText: 'OK',
        cancelText: 'Cancel',
        onOk: () => {
          this.delAutoControlToServer(item.control_id, (err, msg) => {
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
    }
  },
  mounted () {
    this.fetchTableDataFromServer()
    this.fetchEventListFromServer()
  }
}
</script>

<style lang="scss">
.ivu-select-single {
  width: 100% !important;
}
.ivu-select-dropdown {
  position: absolute !important;
}
</style>
