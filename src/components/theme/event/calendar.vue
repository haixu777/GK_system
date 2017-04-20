<template lang="html">
  <div class="calendar clearfix">

    <!-- <Button type="primary" shape="circle" icon="calendar"></Button> -->
    <div class="" style="text-align: right;">
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
    </div>
    <Table stripe :columns="columns" :data="tableData" size="small" border></Table>
    <br>
    <Page :total="totalItem" style="float: right" show-total></Page>

    <Modal
      v-model="modal_detail"
      class="modal_detail"
      :width="720"
      :scrollable="true"
      :closable="false">
      <p slot="header" style="color:#f60;">
        <Icon type="ios-information"></Icon>
        <span>xx事件</span>
      </p>
      <div class="modal_detail_content">
        <Collapse v-model="collapse" accordion>
          <Panel name="timeline">
            时间轴
            <div slot="content">
              <div class="timeline">
                <Timeline style="">
                  <Timeline-item>
                    <Icon type="ios-circle-filled" slot="dot"></Icon>
                    <p class="time">1976年</p>
                    <p class="content">Apple I 问世</p>
                    <p class="content">Apple I2 问世</p>
                </Timeline-item>
                <Timeline-item>
                    <Icon type="arrow-down-c" slot="dot"></Icon>
                    <p class="time">1984年</p>
                    <p class="content">发布 Macintosh</p>
                </Timeline-item>
                <Timeline-item>
                    <Icon type="arrow-down-c" slot="dot"></Icon>
                    <p class="time">2007年</p>
                    <p class="content">发布 iPhone</p>
                </Timeline-item>
                <Timeline-item>
                    <Icon type="arrow-down-c" slot="dot"></Icon>
                    <p class="time">2010年</p>
                    <p class="content">发布 iPad</p>
                </Timeline-item>
                <Timeline-item>
                    <p class="time">2011年10月5日</p>
                    <p class="content">史蒂夫·乔布斯去世</p>
                  </Timeline-item>
                </Timeline>
              </div>
            </div>
          </Panel>
          <Panel name="sample">
            取证样本
            <div slot="content" class="clearfix">
              <Table :columns="sample_columns" :data="sample_tableData" border size="small"></Table>
            </div>
          </Panel>
          <Panel name="control">
            管控方案
            <div slot="content">
              <Table :columns="control_columns" :data="control_tableData" border size="small"></Table>
            </div>
          </Panel>
        </Collapse>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modal: false,
      activeMonth: '',
      date: '',
      modal_detail: false,
      collapse: '',
      control_columns: [
        { title: '类型', key: 'sample_type' },
        { title: '管控时间', key: 'control_time' },
        { title: '描述', key: 'control_descript' }
      ],
      control_tableData: [
        { sample_type: '文本', control_time: '2016年8月11日 12:33:10', control_descript: '描述xxx' },
        { sample_type: '文本', control_time: '2016年12月4日 08:30:44', control_descript: '描述xxx' },
        { sample_type: '文本', control_time: '2017年4月15日 04:03:10', control_descript: '描述xxx' },
        { sample_type: '文本', control_time: '2017年9月11日 12:12:10', control_descript: '描述xxx' }
      ],
      sample_columns: [
        { title: '名称', key: 'sample_title' },
        { title: '取证时间', key: 'forensic_data' },
        {
          title: '操作',
          key: 'action',
          render () {
            return `
              <i-button type="ghost" size="small">
                <a target="_blank" href="${require('/Users/haixu/Desktop/avatar1.png')}">查看</a>
              </i-button>
            `
          }
        }
      ],
      sample_tableData: [
        { sample_title: 'test.png', forensic_data: '2016年8月11日 12:33:10' },
        { sample_title: 'test.png', forensic_data: '2016年8月11日 12:33:10' }
      ],
      columns: [
        { title: '日期', key: 'day' },
        { title: '事件名', key: 'name' },
        { title: '描述', key: 'descript' },
        { title: '发生时间', key: 'occurrence_time' },
        {
          title: '操作',
          key: 'action',
          render () {
            return `<i-button type="ghost" size="small" @click="handleToDetails">查看</i-button>`
          }
        }
      ],
      tableData: [
        { day: 1, name: 'xx事件a', descript: 'xx描述', harm_level: 0.9 },
        { day: 3, name: 'xx事件b', descript: 'xx描述', harm_level: 0.7 },
        { day: 3, name: 'xx事件c', descript: 'xx描述', harm_level: 0.9 },
        { day: 14, name: 'xx事件d', descript: 'xx描述', harm_level: 1.1 },
        { day: 26, name: 'xx事件e', descript: 'xx描述', harm_level: 0.2 },
        { day: 30, name: 'xx事件f', descript: 'xx描述', harm_level: 0.6 }
      ],
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
      }
    }
  },
  methods: {
    handleMonthSelect () {
      console.log(this.date)
    },
    handleToDetails () {
      this.modal_detail = true
    }
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
</style>
