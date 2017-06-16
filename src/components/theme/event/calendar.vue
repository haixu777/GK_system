<template lang="html">
  <div class="calendar">
    <full-calendar
      :events="fcEvents"
      @changeMonth="handleMonthChange"
      @eventClick="handleEventClick"
      lang="zh">
      <div slot="fc-header-left">
        <Button :type="noticeShow ? `error` : `success`" shape="circle" @click="handleNoticeClick" size="small">
          {{ noticeShow ? `关闭提醒` : `获取提醒` }}
        </Button>
      </div>
      <div slot="fc-header-right">
        <Select
          v-model="calendar_conditions.view"
          style="width: 100px;display: inline-block"
          placeholder="视角选择"
          @on-change="fetchEventByMonthFromServer">
          <Option :value="1">管控时段</Option>
          <Option :value="0">发生时间</Option>
        </Select>
        <Select
          v-model="calendar_conditions.recurrence"
          style="width: 100px;display: inline-block"
          placeholder="事件过滤"
          @on-change="fetchEventByMonthFromServer">
          <Option :value="0">所有</Option>
          <Option :value="1">周期性</Option>
        </Select>
      </div>
    </full-calendar>
      <!--
      <Date-picker
        type="daterange"
        confirm
        placement="bottom-end"
        placeholder="选择日期"
        style="width: 200px;display: inline-block"
        v-model="date"
        :options="date_options"
        @on-ok="handleMonthSelect">
      </Date-picker>
      -->
      <!-- <Button type="primary" shape="circle" icon="calendar" @click="openCalendar"></Button> -->
    <!-- <Table stripe :columns="columns" :data="tableData" size="small" border @on-row-click="openEventDetail"></Table> -->
    <!-- <br> -->
    <!-- <Page :total="totalItem" style="float: right" show-total></Page> -->
    <!--
    <Modal v-model="modal_calendar" width="800" @on-ok="handleMonthSelect">
      <full-calendar
        :events="fcEvents"
        @changeMonth="handleMonthChange"
        @eventClick="handleEventClick"
        locale="en">
        <div slot="fc-header-left">
          <span style="color: #f60;">历史的今天</span>
        </div>
      </full-calendar>
    </Modal>
    -->

    <Modal
      v-model="modal_detail"
      class="modal_detail"
      :width="720"
      :scrollable="true"
      :closable="false">
      <p slot="header" style="color:#f60;">
        <Icon type="ios-information"></Icon>
        <span>{{ eventName }}</span>
      </p>
      <div class="modal_detail_content">
        <Collapse v-model="collapse" accordion>
          <Panel name="descript">
            事件背景
            <div slot="content">
              {{ eventDescript }}
            </div>
          </Panel>
          <Panel name="process">
            事件流程
            <div slot="content">
              <!-- <img :src="require('assets/data/samples/zhongmu.png')" alt=""> -->
              <plumb></plumb>
            </div>
          </Panel>
          <Panel name="timeline">
            管控历史
            <div slot="content">
              <div class="timeline">
                <Timeline style="">
                <Timeline-item v-for="item in timelineList" :key="item.id">
                  <Icon type="arrow-down-c" slot="dot"></Icon>
                  <p class="time">{{ item.time }}</p>
                  <p class="content">{{ item.content }}</p>
                  <p class="content">
                    处置方案：
                    <span style="color: #f40;">{{ item.action }}</span>
                  </p>
                </Timeline-item>
                </Timeline>
              </div>
            </div>
          </Panel>
          <Panel name="sample">
            取证样本
            <div slot="content" class="clearfix">
              <!-- <Table :columns="sample_columns" :data="sample_tableData" border size="small"></Table> -->
              <el-table
                :data="sample_tableData"
                border
                style="width: 99%">
                <el-table-column label="名称" prop="sample_title">
                </el-table-column>
                <el-table-column label="取证时间" prop="forensic_date">
                </el-table-column>
                <el-table-column label="操作" prop="sample_path">
                  <template scope="scope">
                    <i-button type="success" size="small" icon="android-download">
                      <a :href="'http://'+ localUrl +':3000/sample/download?id='+scope.row.id" style="color:#fff;" download>下载</a>
                    </i-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </Panel>
          <!--
          <Panel name="control">
            管控方案
            <div slot="content">
              <Table :columns="control_columns" :data="control_tableData" border size="small"></Table>
            </div>
          </Panel>
        -->
        </Collapse>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
const $utils = require('utils')
const Plumb = require('./jsplumb')
export default {
  components: {
    Plumb
  },
  data () {
    return {
      modal: false,
      noticeShow: true,
      activeMonth: (new Date()).getMonth() + 1,
      date: '',
      eventId: '',
      eventName: '',
      eventDescript: '',
      modal_detail: false,
      modal_calendar: false,
      collapse: '',
      calendar_conditions: {
        view: 0,
        recurrence: 0
      },
      timelineList: [],
      control_columns: [
        { title: '范围', key: 'control_range' },
        { title: '管控时间', key: 'control_time' },
        { title: '描述', key: 'control_descript' }
      ],
      control_tableData: [],
      sample_tableData: [],
      localUrl: '',
      columns: [
        { title: '日期', key: 'date' },
        { title: '事件名', key: 'name' },
        { title: '描述', key: 'descript' },
        { title: '发生时间', key: 'occurrence_time' },
        {
          title: '操作',
          key: 'action',
          render () {
            return `<i-button type="ghost" size="small" @click="handleToDetails()">查看</i-button>`
          }
        }
      ],
      tableData: [],
      totalItem: 100,
      date_options: {
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
      fcEvents: []
    }
  },
  watch: {
    collapse (val) {
      let value = val[0]
      if (value === 'control') {
        this.fetchControl()
      } else if (value === 'sample') {
        this.fetchSample()
      } else if (value === 'timeline') {
        this.fetchTimelineFromServer()
      } else if (value === 'process') {
        this.$emit('initChart')
      }
    },
    modal_detail (val) {
      if (!val) this.collapse = ''
    }
  },
  methods: {
    handleMonthSelect () {
      this.fetchEventListFromServer()
    },
    handleToDetails () {
      this.modal_detail = true
    },
    fetchEventListFromServer () {
      this.$axios.get('/events/list', {
        params: {
          month: this.activeMonth
        }
      }).then((res) => {
        this.tableData = res.data.eventList
      })
    },
    fetchControl () {
      this.$axios.get('/events/fetchEventControl', {
        params: {
          id: this.eventId
        }
      }).then((res) => {
        this.control_tableData = res.data.controlList
        this.control_tableData.forEach((item) => {
          item['control_time'] = $utils.formatTime(item['control_time'])
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    fetchSample () {
      this.$axios.get('/events/fetchEventSample', {
        params: {
          id: this.eventId
        }
      }).then((res) => {
        this.sample_tableData = res.data.sampleList
        this.sample_tableData.forEach((item) => {
          item['forensic_date'] = $utils.formatTime(item['forensic_date'])
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    fetchEventByMonthFromServer () {
      this.$axios.get('/events/fetchEventByMonth', {
        params: {
          recurrence: this.calendar_conditions.recurrence,
          view: this.calendar_conditions.view
        }
      }).then((res) => {
        this.fcEvents = res.data.eventsList
      }).catch((err) => {
        console.log(err)
      })
    },
    handleNoticeClick () {
      this.noticeShow = !this.noticeShow
      if (!this.noticeShow) {
        this.$Notice.destroy()
      } else {
        this.fetchNoticeFromServer()
      }
    },
    fetchNoticeFromServer () {
      this.$axios.get('/events/notice')
        .then((res) => {
          let noticeList = res.data.noticeList
          noticeList.forEach((item, i) => {
            setTimeout(() => {
              // 有害评级DOM控制
              let warnStarDom = ''
              if (!Number(item.harm_level)) {
                // warnStarDom = '<span style="color:green">无</span>'
                warnStarDom = '&nbsp;<i class="ivu-icon ivu-icon-android-happy" style="color:#19be6b;font-size:20px;"></i>'
              } else {
                for (let i = 0; i < Number(item.harm_level); i++) {
                  warnStarDom += `<span class="el-rate__item" style="cursor: auto;"><i class="el-rate__icon el-icon-star-on" style="color: rgb(247, 186, 42);"></i></span>`
                }
              }

              // 管控事件DOM控制
              let controlDom = ''
              let now = new Date()
              let itemStart = new Date(item.control_start_time)
              let timeStart = now.getTime() - itemStart.getTime()
              let itemEnd = new Date(item.control_end_time)
              let timeEnd = now.getTime() - itemEnd.getTime()
              if (timeStart < 0) {
                controlDom = `距离管控: <span style="color:#f40;">${Math.abs(Math.floor(timeStart / (1000 * 60 * 60 * 24)))}</span> 天`
              }
              if (timeEnd > 0) {
                controlDom = `管控结束: <span style="color:#f40;">${Math.abs(parseInt(timeEnd / (1000 * 60 * 60 * 24)))}</span> 天`
              }
              if (timeStart > 0 && timeEnd < 0) {
                controlDom = `已经管控: <span style="color:#f40;">${Math.abs(parseInt(timeStart / (1000 * 60 * 60 * 24)))}</span> 天`
              }

              // Notice
              this.$Notice.warning({
                title: item.name,
                duration: 0,
                key: 'events',
                desc: `
                  危害等级: ${warnStarDom}
                  <br>
                  ${controlDom}
                  <br>
                `
              })
            }, 100 * i)
          })
        }).catch((err) => {
          console.log(err)
        })
    },
    fetchTimelineFromServer () {
      this.$axios.get('/events/timeline', {
        params: {
          eventId: this.eventId
        }
      }).then((res) => {
        this.timelineList = res.data.timeline
      }).catch((err) => {
        console.log(err)
      })
    },
    openEventDetail (node) {
      this.eventName = node.name
      this.eventId = node.id
      this.eventDescript = node.descript
    },
    openCalendar () {
      this.modal_calendar = true
      this.fetchEventByMonthFromServer()
    },
    handleMonthChange (start, end, current) {
      let date = new Date(current)
      this.activeMonth = date.getMonth() + 1
    },
    handleEventClick (event, jsEvent, pos) {
      this.handleToDetails()
      this.openEventDetail({name: event.title, id: event.id, descript: event.descript})
    },
    handleSamplePath (path) {
      if (!path) return '#'
      return require('../../../assets/' + path + '.png')
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
    // this.fetchEventListFromServer()
    this.fetchEventByMonthFromServer()
    this.fetchNoticeFromServer()
    this.handleLocalUrl()
  }
}
</script>

<style lang="scss">
  table {
    width: 100%;
  }
  .month_container {
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    justify-content: center;
    li {
      width: 100px;
      margin: 5px;
      .active {
        background: #00cc66;
      }
    }
  }
  .modal_detail {
    .ivu-modal {
      .ivu-modal-content {
        .ivu-modal-body {
          max-height: 600px;
          overflow: auto;
        }
      }
    }
  }
  .modal_detail_content {
    text-align: left;
    .timeline {
      display: inline-block;
    }
    .sample_container {
    }
  }
  .comp-full-calendar {
    .day-cell {
      box-sizing: content-box;
    }
  }
  .full-calendar-header .header-right {
    flex: none !important;
  }
  .ivu-rate-star-content:before, .ivu-rate-star:before {
    cursor: initial !important;
  }
</style>
