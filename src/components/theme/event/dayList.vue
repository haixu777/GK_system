<template lang="html">
  <div class="dayList_container">
    <!-- {{ eventList }} -->
    <el-table :data="eventList">
      <el-table-column prop="name" label="事件名"></el-table-column>
      <!-- <el-table-column prop="descript" label="事件描述"></el-table-column> -->
      <el-table-column label="危害等级">
        <template scope="scope">
          <el-rate
            v-model="(scope.row.harm_level)"
            disabled
            :max="3"
            text-color="#ff9900"
            @change="handleRate">
          </el-rate>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="occurrence_time" label="发生时间"></el-table-column> -->
      <!-- <el-table-column prop="control_start_time" label="管控开始时间"></el-table-column> -->
      <!-- <el-table-column prop="control_end_time" label="管控结束时间"></el-table-column> -->
      <el-table-column label="管控时间" width="180">
        <template scope="scope">
          <span>{{ scope.row.control_start_time ? (scope.row.control_start_time + ' - ' + scope.row.control_end_time) : '暂无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template scope="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '暂无' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template scope="scope">
          <Button type="error" size="small" @click="handleDel(scope.row.name, scope.row.id)">删除</Button>
          <Button type="primary" size="small" @click="handleEdit(scope.row)">编辑</Button>
        </template>
      </el-table-column>
    </el-table>
    <div class="" style="text-align:center;margin-top:5px">
      <Button type="success" icon="ios-plus" size="small" @click="handleAdd">添加</Button>
    </div>

    <Modal v-model="eventAdd_modal" width="400" @on-cancel="cancelEventAdd">
      <p slot="header" style="color:#39f;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ isEdit ? '事件编辑' : '事件添加' }}</span>
      </p>
      <div style="">
        <Form ref="eventForm" :model="eventForm" :label-width="80">
          <Form-item label="名称" prop="name">
            <Input v-model="eventForm.name" placeholder="请输入名称"></Input>
          </Form-item>
          <Form-item label="简介" prop="descript">
            <Input
              v-model="eventForm.descript"
              placeholder="请描述简介"
              type="textarea"></Input>
          </Form-item>
          <!--
          <Form-item label="编辑时间" prop="edit_time">
            <Date-picker type="date" placeholder="选择日期" style="width: 200px" v-model="eventForm.edit_time"></Date-picker>
          </Form-item>
          -->
          <!--
          <Form-item label="发生时间" prop="harm_level">
            <span>{{ (eventForm.occurrence_time) }}</span>
          </Form-item>
          -->
          <Form-item label="危害等级" prop="harm_level">
            <Slider v-model="eventForm.harm_level" :max="3" :show-input="true" :show-stops="true"></Slider>
            <!-- <el-slider v-model="eventForm.harm_level" :max="2" show-input></el-slider> -->
          </Form-item>
          <Form-item label="类型" prop="type">
            <Radio-group v-model="eventForm.type">
              <Radio label="0">
                <span>事件集合</span>
              </Radio>
              <Radio label="1">
                <span>事件个体</span>
              </Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="事件分类" prop="category">
            <Radio-group v-model="eventForm.category">
              <Radio label="1">
                <span>重大专项</span>
              </Radio>
              <Radio label="2">
                <span>值班关注</span>
              </Radio>
              <Radio label="3">
                <span>其他</span>
              </Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="发生时间" prop="occurrence_time">
            <Date-picker type="date" placeholder="选择日期" style="" v-model="eventForm.occurrence_time"></Date-picker>
          </Form-item>
          <Form-item label="预警时间">
            <Date-picker
              type="daterange"
              placement="bottom-end"
              placeholder="选择日期"
              v-model="eventForm.alertRange">
            </Date-picker>
          </Form-item>
          <Form-item label="周期性" prop="recurrence">
            <Radio-group v-model="eventForm.recurrence">
              <Radio label="0">
                <span>否</span>
              </Radio>
              <Radio label="1">
                <span>是</span>
              </Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="层级" prop="level">
            <el-cascader
              style="width:100%;"
              :options="treeData"
              :props="defaultProps"
              :clearable="true"
              change-on-select
              v-model="eventForm.level">
            </el-cascader>
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Input v-model="eventForm.remark" placeholder="请输入备注"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="handleEventConfirm">
          {{ isEdit ? '更新' : '添加' }}
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
const $utils = require('utils')
export default {
  data () {
    return {
      eventList: [],
      eventAdd_modal: false,
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      eventForm: {
        id: '',
        name: '',
        parent_id: '',
        descript: '',
        occurrence_time: '',
        level: [],
        type: 0,
        edit_time: '',
        harm_level: 0,
        recurrence: 0,
        alertRange: [],
        category: 1,
        remark: ''
      },
      isEdit: false
    }
  },
  props: ['time', 'treeData'],
  watch: {
    time (val) {
      this.fetchEventListFromServer()
    }
  },
  methods: {
    fetchEventListFromServer () {
      if (!this.time) return
      this.$axios.get('/events/fetchByDay', {
        params: {
          month: ((this.time).getMonth() + 1),
          day: (this.time).getDate()
        }
      }).then((res) => {
        // this.eventList = res.data.eventsList
        this.eventList = res.data.eventsList.map((item) => {
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
    handleEventConfirm () {
      this.$axios.post('/events/update', {
        id: this.eventForm.id,
        name: this.eventForm.name,
        parent_id: this.eventForm.level[-1],
        descript: this.eventForm.descript,
        occurrence_time: this.eventForm.occurrence_time === '' ? null : this.eventForm.occurrence_time,
        type: this.eventForm.type,
        level: this.eventForm.level,
        edit_time: this.eventForm.edit_time,
        harm_level: this.eventForm.harm_level,
        recurrence: this.eventForm.recurrence,
        alertRange: this.eventForm.alertRange,
        category: this.eventForm.category,
        remark: this.eventForm.remark
      }).then((res) => {
        this.eventAdd_modal = false
        this.cancelEventAdd()
        this.fetchEventListFromServer()
        let str = res.data.msg.split(',')
        this.$Notice.success({
          title: str[1],
          desc: str[0]
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    handleEdit (_event) {
      this.cancelParentModal()
      this.eventAdd_modal = true
      this.eventForm = {
        id: _event.id,
        name: _event.name,
        parent_id: _event.parent_id,
        descript: _event.descript,
        occurrence_time: _event.occurrence_time,
        level: $utils.formatEventLevel(_event.level),
        type: _event.type,
        edit_time: _event.edit_time,
        harm_level: _event.harm_level,
        recurrence: _event.recurrence,
        alertRange: [_event.control_start_time, _event.control_end_time],
        category: _event.category,
        remark: _event.remark
      }
      this.isEdit = true
    },
    handleDel (name, id) {
      this.$Modal.confirm({
        title: '确认删除？',
        content: '事件：' + name + ', 删除后将无法恢复',
        onOk: () => {
          this.delEventsFromServer(id)
        },
        onCancel: () => {
          this.$Message.info('删除取消')
        }
      })
    },
    delEventsFromServer (id) {
      this.$axios.post('/events/del', {id: id})
        .then((res) => {
          this.$emit('fetchTree')
          let str = res.data.msg.split(',')
          this.$Notice.success({
            title: str[1],
            desc: str[0]
          })
          this.fetchEventListFromServer()
        }).catch((err) => {
          console.log(err)
        })
    },
    cancelParentModal () {
      this.$emit('closeDayListModal', 'close')
    },
    cancelEventAdd () {
      this.eventForm = {
        id: '',
        name: '',
        parent_id: '',
        descript: '',
        occurrence_time: this.time,
        level: [],
        type: 0,
        edit_time: '',
        harm_level: 0,
        recurrence: 0,
        alertRange: [],
        category: 1,
        remark: ''
      }
      this.$emit('closeDayListModal', 'show')
    },
    handleAdd () {
      this.eventForm = {
        id: '',
        name: '',
        parent_id: '',
        descript: '',
        occurrence_time: this.time,
        level: [],
        type: 0,
        edit_time: '',
        harm_level: 0,
        recurrence: 0,
        alertRange: [],
        category: 1,
        remark: ''
      }
      this.cancelParentModal()
      this.eventAdd_modal = true
      this.isEdit = false
    },
    handleRate (val) {
      console.log(`handle rate: ${val}`)
    }
  },
  mounted () {
    this.fetchEventListFromServer()
  }
}
</script>

<style lang="css">
</style>
