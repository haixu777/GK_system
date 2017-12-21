<template lang="html">
  <div class="statistics clearfix" style="padding: 10px;">
    <Tabs>
      <TabPane label="事件纬度" icon="social-apple">
        <div class="event_statistics">
          <div class="category_tree">
            <Input
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </Input>
            <el-tree
              :data="treeData"
              :props="defaultProps"
              :filter-node-method="filterNode"
              style="min-width: 120px;"
              ref="tree"
              @node-click="handleEventClick"
              :highlight-current="true">
            </el-tree>
          </div>
        </div>
        <div class="statistics_content">
          <div class="time_item" v-for="content, title in statisticsData" v-if="!emptyCheck(content) && title">
            <span style="color: #f40;">{{ title }}</span>
            <div class="" v-for="a,b in content" style="">
              {{ b }} : {{ a }}
            </div>
          </div>
        </div>
      </TabPane>
      <TabPane label="时间纬度" icon="social-windows" style="text-align:center;">
        <DatePicker
          type="daterange"
          placement="bottom"
          placeholder="时间范围选择"
          @on-change="fetchStatisticsFromServerByTime"
          style="width: 200px;text-align:center;">
        </DatePicker>
        <div class="event_statistics" style="text-align:left;">
          <div class="time_item" v-for="content, title in statisticsTimeData" v-if="!emptyCheck(content) && title">
            <span style="color:#f40;">{{ title }}</span>
            <div class="" v-for="a,b in content" style="">
              {{ b }} : {{ a }}
            </div>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      treeData: [],
      filterText: '',
      statisticsData: [],
      statisticsTimeData: []
    }
  },
  components: {
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    fetchEventsTreeFromServer () {
      this.$axios.get('/events/tree')
        .then((res) => {
          this.treeData = res.data.tree
          this.eventForm.id = null
        }).catch((err) => {
          console.log(err)
        })
    },
    fetchStatisticsFromServerByEventId (id) {
      this.$axios.get('/control/statisticsByEventId', {
        params: {
          eventId: id
        }
      }).then((res) => {
        let temp = {}
        if (res.data.data) {
          res.data.data.map((d) => { // 初始化操作名
            temp[d.control_operation.replace(/(^\s+)|(\s+$)/g, '')] = {}
          })
          res.data.data.map((d) => { // 初始化操作样本
            if (!d.sample_type) return
            temp[d.control_operation.replace(/(^\s+)|(\s+$)/g, '')][d.sample_type] = 0
          })
          res.data.data.map((d) => { // 数量相加，如果数量为空，重置为1
            if (!d.sample_type) return
            if (!d.control_number) d.control_number = 1
            temp[d.control_operation.replace(/(^\s+)|(\s+$)/g, '')][d.sample_type] += d.control_number
          })
        }
        this.statisticsData = temp
      }).catch((err) => {
        console.log(err)
      })
    },
    fetchStatisticsFromServerByTime (timeRange) {
      this.$axios.get('/control/statisticsByTime', {
        params: {
          time_start: timeRange[0],
          time_end: timeRange[1]
        }
      }).then((res) => {
        let temp = {}
        if (res.data.data) {
          res.data.data.map((d) => { // 初始化操作名
            temp[d.control_operation.replace(/(^\s+)|(\s+$)/g, '')] = {}
          })
          res.data.data.map((d) => { // 初始化操作样本
            if (!d.sample_type) return
            temp[d.control_operation.replace(/(^\s+)|(\s+$)/g, '')][d.sample_type] = 0
          })
          res.data.data.map((d) => { // 数量相加，如果数量为空，重置为1
            if (!d.sample_type) return
            if (!d.control_number) d.control_number = 1
            temp[d.control_operation.replace(/(^\s+)|(\s+$)/g, '')][d.sample_type] += d.control_number
          })
        }
        this.statisticsTimeData = temp
      }).catch((err) => {
        console.log(err)
      })
    },
    handleMenuSelect (name) {
      this.activeMenu = name
    },
    handleEventClick (e) {
      this.fetchStatisticsFromServerByEventId(e.id)
    },
    emptyCheck (content) {
      for (var key in content) {
        return false
      }
      return true
    }
  },
  mounted () {
    this.fetchEventsTreeFromServer()
  }
}
</script>

<style lang="scss">
  .statistics {
    box-sizing: border-box;
    text-align: left;
    .time_item {
      position: relative;
      display: inline-block;
      background: #fbfdff;
      border-radius: 5px;
      border: 1px solid #dfe6ec;
      padding: 10px 20px;
      margin: 5px;
      text-align: left;
      vertical-align: top;
    }
    .category_tree {
      width: 25%;
      display: inline-block;
      float: left;
    }
    .statistics_content {
      width: 74%;
      margin-left: 1%;
      margin-top: 33px;
      display: inline-block;
      float: left;
      // border: 1px solid #d1dbe5;
      // display: box;
      // display: -webkit-box;
      // display: -moz-box;

      .submenu {
        .ivu-menu-item-group-title {
          color: #f40;
        }
      }
      .content {
        box-flex: 1;
        -webkit-box-flex: 1;
        -moz-box-flex: 1;
        padding: 25px;
        border-left: 1px solid #d7dde4;
        min-height: 500px;
      }

      .ivu-input-group {
        width: 35% !important;
      }
      .ivu-form-item-content {
        width: 230px;
      }
      .ivu-slider-button {
        border: 2px solid #f40;
      }
      .ivu-slider-bar {
        background: #f40;
      }
    }
    .el-icon-circle-close {
      z-index: 1;
    }
  }

</style>
