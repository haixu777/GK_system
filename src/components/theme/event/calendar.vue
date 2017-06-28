<template lang="html">
  <div class="calendar clearfix">
    <div class="calendar_left">
      <full-calendar
        :events="fcEvents"
        @changeMonth="handleMonthChange"
        @eventClick="handleEventClick"
        @dayClick="handleDayClick"
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
    </div>
    <div class="calendar_right clearfix">
      <div class="item_container" v-for="item in dayList">
        <i-button
        size="small"
        type="success"
        style="position:absolute;right:9px;"
        @click="handleEventCardClick({title: item.name, id: item.id, descript: item.descript})">查看详情</i-button>
        <el-form>
          <el-form-item label="事件名称" class="title">
            <span>{{ item.name }}</span>
          </el-form-item>
          <el-form-item label="描述" class="content">
            <span>{{ item.descript }}</span>
          </el-form-item>
          <el-form-item label="危害等级">
            <el-rate
              v-if="item.harm_level"
              style="line-height: 46px;"
              v-model="(item.harm_level)"
              disabled
              :max="3"
              text-color="#ff9900">
            </el-rate>
            <i v-else class="ivu-icon ivu-icon-android-happy" style="color:#19be6b;font-size:20px;"></i>
          </el-form-item>
          <el-form-item label="管控时间">
            <span>{{  item.control_start_time ? (item.control_start_time + ' - ' + item.control_end_time) : '暂无' }}</span>
          </el-form-item>
          <el-form-item label="备注">
            <span>{{ item.remark ? item.remark : '暂无' }}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
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
              <process-upload :eventId="eventId" v-if="activeProcess"></process-upload>
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

    <Modal
    v-model="modal_eventForm"
    width="800"
    class="modal_detail"
    :scrollable="true"
    :closable="false"
    @on-cancel="fetchEventByMonthFromServer">
      <p slot="header" style="color:#f60;">
        <Icon type="ios-information"></Icon>
        <!-- <span>{{ activeTime.getFullYear() + '-' + activeTime.getMonth() + 1 + '-' + activeTime.getDate() }}</span> -->
        {{ activeTime ? activeTime.getFullYear() + '-' + (activeTime.getMonth() + 1) + '-' + activeTime.getDate() : 'nothing' }}
      </p>
      <div class="event_form">
        <!-- <event-form :eventForm="eventForm" :treeData="treeData" :isGroup="false"></event-form> -->
        <day-list :time="activeTime" :treeData="treeData" @closeDayListModal="closeDayListModal" @updateCalendar="fetchEventByMonthFromServer"></day-list>
      </div>
      <div slot="footer">
        <!-- <i-button type="primary" long :disabled="!(eventForm.name)" @click="handleEventConfirm">确认添加</i-button> -->
      </div>
    </Modal>
  </div>
</template>

<script>
const $utils = require('utils')
const dayList = require('./dayList')
const eventForm = require('./submenu/details')
const processUpload = require('./processUpload')
export default {
  components: {
    eventForm,
    dayList,
    processUpload
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
      timer: null,
      count: 0,
      modal_eventForm: false,
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
      fcEvents: [],
      eventForm: {
        id: '',
        name: '',
        parent_id: '',
        descript: '',
        occurrence_time: '',
        level: [],
        type: 1,
        edit_time: '',
        harm_level: 0,
        recurrence: 0,
        alertRange: [],
        category: 1,
        remark: ''
      },
      treeData: [],
      activeTime: null,
      dayList: [],
      activeDay: null,
      activeProcess: false
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
        this.activeProcess = true
      } else {
        this.activeProcess = false
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
    fetchEventListByDayFromServer (time) {
      if (!time) return
      this.$axios.get('/events/fetchByDay', {
        params: {
          month: ((time).getMonth() + 1),
          day: (time).getDate()
        }
      }).then((res) => {
        this.dayList = res.data.eventsList.map((item) => {
          for (var prop in item) {
            if (prop === 'control_start_time' || prop === 'control_end_time') {
              if (!(item[prop])) return item
              item[prop] = $utils.formatTime(item[prop])
            }
          }
          return item
        })
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
        this.modal_eventForm = false
        this.$Notice.destroy()
        this.fetchEventListByDayFromServer(this.activeDay)
        this.fetchNoticeFromServer()
      }).catch((err) => {
        console.log(err)
      })
    },
    handleEventConfirm () {
      this.$axios.post('/events/update', {
        id: '',
        name: this.eventForm.name,
        parent_id: this.eventForm.level[-1],
        descript: this.eventForm.descript,
        occurrence_time: this.eventForm.occurrence_time,
        type: this.eventForm.type,
        level: this.eventForm.level,
        edit_time: new Date(),
        harm_level: this.eventForm.harm_level,
        recurrence: this.eventForm.recurrence,
        alertRange: this.eventForm.alertRange,
        category: this.eventForm.category,
        remark: this.eventForm.remark
      }).then((res) => {
        let str = res.data.msg.split(',')
        this.$Notice.success({
          title: str[1],
          desc: str[0]
        })
        this.fetchEventByMonthFromServer()
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
          this.noticeShow = true
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
    fetchEventsTreeFromServer () {
      this.$axios.get('/events/tree')
        .then((res) => {
          this.treeData = res.data.tree
          this.eventForm.id = ''
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
      this.handleDayClick(new Date(event.start))
    },
    handleEventCardClick (event) {
      this.handleToDetails()
      this.openEventDetail({name: event.title, id: event.id, descript: event.descript})
    },
    handleDayClick (day, jsEvent) {
      // will use to handle doubleClick soon...
      // this.timer = null
      this.count++
      this.timer = setTimeout(() => {
        if (this.count === 2) { // double click: 双击显示以天为单位的事件列表x
          if (($utils.Cookie.get('isAdmin')).toString() === 'true') { // 管理员用户
            this.activeTime = new Date(day)
            this.eventForm.occurrence_time = new Date(day)
            this.eventForm.name = ''
            this.modal_eventForm = true
          } else { // 普通用户
            console.log(111)
          }
        } else { // click: 显示事件
          this.activeDay = day
          this.fetchEventListByDayFromServer(this.activeDay)
        }
        this.count = 0
        clearTimeout(this.timer)
      }, 300)
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
    },
    closeDayListModal (val) {
      if (val === 'close') {
        this.modal_eventForm = false
      } else {
        this.modal_eventForm = true
      }
    }
  },
  mounted () {
    // this.fetchEventListFromServer()
    this.fetchEventsTreeFromServer()
    this.fetchEventByMonthFromServer()
    this.handleLocalUrl()
  }
}
</script>

<style lang="scss">
  .calendar {
    display: flex;
    display: -webkit-flex;
    .calendar_left {
      width: 50%;
      min-width: 800px;
      float: left;
    }
    .calendar_right {
      width: 50%;
      max-height: 678px;
      margin-top: 67px;
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
      align-self: flex-start;
    }
  }
  .item_container {
    position: relative;
    display: inline-block;
    background: #fbfdff;
    border-radius: 5px;
    border: 1px solid #dfe6ec;
    width: 450px;
    padding: 10px 20px;
    margin: 5px;
    text-align: left;
    label {
      width: 70px;
      color: #99a9bf;
    }
    .el-form-item {
      margin-bottom: 0 !important;
    }
    .el-form-item__content {
      display: inline-block;
      width: 330px;
    }
    .title .el-form-item__content {
      width: 280px;
    }
    .content .el-form-item__content {
      margin-top: 7px;
      line-height: 22px;
    }
  }
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
  .event_form .details_btn {
    display: none;
  }
</style>
