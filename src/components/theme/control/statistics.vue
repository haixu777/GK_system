<template lang="html">
  <div class="statistics clearfix" style="padding: 10px;">
    <BackTop :height="100" :bottom="200">
      <div class="top">返回顶端</div>
    </BackTop>
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
        <div class="" style="display:inline-block;width:50%;float:left;margin-left:20px;">
          <el-table
            border
            stripe
            max-height="500"
            :data="statisticsData">
            <el-table-column
              prop="control_operation"
              label="操作"
              width="">
            </el-table-column>
            <el-table-column
              prop="sample_type"
              label="类型"
              width="">
            </el-table-column>
            <el-table-column
              prop="control_number"
              width=""
              label="数量">
            </el-table-column>
          </el-table>
        </div>
        <!-- <div class="statistics_content">
          <div class="time_item" v-for="content, title in statisticsData" v-if="!emptyCheck(content) && title">
            <span style="color: #f40;">{{ title }}</span>
            <div class="" v-for="a,b in content" style="">
              {{ b }} : {{ a }}
            </div>
          </div>
        </div> -->
      </TabPane>
      <TabPane label="时间纬度" icon="social-windows" style="text-align:center;">
        <!-- <DatePicker
          type="daterange"
          placement="bottom"
          placeholder="时间范围选择"
          @on-change="fetchStatisticsFromServerByTime"
          style="width: 200px;text-align:center;">
        </DatePicker> -->
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          @change="fetchStatisticsFromServerByTime"
          placeholder="选择时间范围">
        </el-date-picker>
        <div class="event_statistics" style="text-align:left;">
          <div class="time_item timeRange_item" v-for="item in statisticsTimeData" v-if="!emptyCheck(item.control)">
            <div style="border-bottom:1px solid #000; color:#f40;">{{ item.name }}</div>
            <div class="">
              <el-table
                border
                stripe
                max-height="350"
                :data="item.control">
                <el-table-column
                  prop="control_operation"
                  label="操作"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="sample_type"
                  label="类型"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="control_number"
                  width="70"
                  label="数量">
                </el-table-column>
              </el-table>
            </div>
          </div>
          <!-- <div class="time_item" v-for="content, title in statisticsTimeData" v-if="!emptyCheck(content) && title">
            <span style="color:#f40;">{{ title }}</span>
            <div class="" v-for="a,b in content" style="">
              {{ b }} : {{ a }}
            </div>
          </div> -->
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
      statisticsTimeData: [],
      timeRange: ''
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
      console.log(this)
      this.$axios.get('/control/statisticsByEventId', {
        params: {
          eventId: id
        }
      }).then((res) => {
        /*
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
        */
        let result = []
        let temp = []
        res.data.data.forEach((item) => {
          if (!item.control_operation) return
          item.control_operation = item.control_operation.replace(/(^\s+)|(\s+$)/g, '')
          if (item.control_number === 0) item.control_number = 1
        })
        res.data.data.forEach((item) => {
          if (item.control_operation) {
            if (item.sample_type) {
              if (!item.sample_type) return
              let skey = item.control_operation + item.sample_type.replace(/(^\s+)|(\s+$)/g, '')
              if (typeof temp[skey] === 'undefined') {
                temp[skey] = item
              } else {
                temp[skey].control_number += item.control_number
              }
            }
          }
        })
        for (var prop in temp) {
          result.push(temp[prop])
        }
        this.statisticsData = result
        console.log(this.statisticsData)
      }).catch((err) => {
        console.log(err)
      })
    },
    fetchStatisticsFromServerByTime (timeRange) {
      this.$Spin.show({
        render: (h) => {
          return h('div', [
            h('Icon', {
              'class': 'demo-spin-icon-load',
              props: {
                type: 'load-c',
                size: 18
              }
            }),
            h('div', '数据生成中，请耐心等待...')
          ])
        }
      })
      let timeArr = timeRange.split(' - ')
      this.$axios.get('/control/statisticsByTime', {
        params: {
          time_start: timeArr[0],
          time_end: timeArr[1]
        }
      }).then((res) => {
        res.data.data.forEach((item) => {
          if (!this.emptyCheck(item.control_programs)) {
            item.control_programs.forEach((control) => {
              if (!control.control_programs) return
              control.control_operation = control.control_operation.replace(/(^\s+)|(\s+$)/g, '')
              if (control.control_number === 0) control.control_number = 1
            })
          }
        })
        res.data.data.forEach((item) => {
          let temp = []
          let result = []
          item.control_programs.forEach((control, index) => {
            if (control.control_operation) {
              if (control.sample_type) {
                let skey = control.control_operation + control.sample_type.replace(/(^\s+)|(\s+$)/g, '')
                if (typeof temp[skey] === 'undefined') {
                  temp[skey] = control
                } else {
                  temp[skey].control_number += control.control_number
                }
              }
            }
          })

          for (var prop in temp) {
            result.push(temp[prop])
          }
          item.control = result
        })
        this.statisticsTimeData = res.data.data
        this.$Spin.hide()
      }).catch((err) => {
        console.log(err)
        this.$Spin.hide()
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
    min-width: 1024px;
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
    .timeRange_item {
      width: 31%;
      min-width: 31%;
    }
    .op_item {
      position: relative;
      display: inline-block;
      background: #eee;
      border-radius: 5px;
      border: 1px solid #dfe6ec;
      padding: 5px;
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
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .top{
    padding: 10px;
    background: rgba(0, 153, 229, .7);
    color: #fff;
    text-align: center;
    border-radius: 2px;
  }
</style>
