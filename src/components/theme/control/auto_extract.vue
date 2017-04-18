<template lang="html">
  <div class="control_container">
    <!-- <Radio-group v-model="status" @on-change="handleStatusChange">
      <Radio :label="0">未标注</Radio>
      <Radio :label="1">已标注</Radio>
    </Radio-group> -->
    <Table :columns="columns" :data="tableData"></Table>
    <Modal v-model="modal_detail">
      <p slot="header" style="color:#39f;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>数据详情</span>
      </p>
      <div style="text-align:center">
      </div>
      <div slot="footer">
      </div>
    </Modal>
    <Modal v-model="modal_delete">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>数据删除将无法找回</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="handleDel">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
const $utils = require('utils')
export default {
  data () {
    return {
      modal_delete: false,
      modal_detail: false,
      tableData: [],
      status: 0,
      activeData: {
        index: ''
      },
      columns: [
        {
          title: '描述',
          key: 'control_descript'
        },
        {
          title: '管控日期',
          key: 'control_time',
          render (row, column, index) {
            return $utils.formatTime(row.control_time)
          },
          sortable: true
        },
        {
          title: '来源',
          key: 'source'
        },
        {
          title: '管控类型',
          key: 'control_type'
        },
        {
          title: '范围',
          key: 'control_range'
        },
        {
          title: '类型',
          key: 'sample_type'
        },
        {
          title: '数量',
          key: 'number',
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
            return `<i-button type="primary" size="small" @click="show(${index})">查看</i-button> <i-button type="error" size="small" @click="remove(${index})">删除</i-button>`
          }
        }
      ]
    }
  },
  methods: {
    fetchControlTableDataFromServer () {
      this.$axios.get('/fetchControl').then((d) => {
        this.tableData = d.data.tableData
      })
    },
    show (index) {
      this.modal_detail = true
    },
    remove (index) {
      this.modal_delete = true
      this.activeData.index = index
    },
    handleStatusChange (val) {
      console.log(val)
    },
    handleDel () {
      this.tableData.splice(this.activeData.index, 1)
      this.modal_delete = false
    }
  },
  mounted () {
    this.fetchControlTableDataFromServer()
  }
}
</script>

<style lang="css">
</style>
