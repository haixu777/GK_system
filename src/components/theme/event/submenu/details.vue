<template lang="html">
  <div class="">
    <Form class="form" ref="eventForm" :model="eventForm" :label-width="80">
      <Form-item label="名称" prop="name">
        <Input v-model="eventForm.name" placeholder="请输入名称"></Input>
      </Form-item>
      <Form-item label="简介" prop="descript">
        <Input
          v-model="eventForm.descript"
          placeholder="请描述简介"
          :rows="5"
          type="textarea"></Input>
      </Form-item>
      <Form-item label="危害等级" prop="harm_level">
        <Slider v-model="eventForm.harm_level" :max="3" :show-input="true" :show-stops="true"></Slider>
      </Form-item>
      <Form-item label="类型" prop="type">
        <Radio-group v-model="eventForm.type">
          <Radio label="0" :disabled="!isGroup">
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
      <Form-item label="发生时间" prop="occurrence_time">
        <!-- <Date-picker type="date" placeholder="选择日期" style="" v-model="eventForm.occurrence_time"></Date-picker> -->
        <el-date-picker
          v-model="eventForm.occurrence_time"
          type="date"
          placeholder="发生时间">
        </el-date-picker>
      </Form-item>
      <Form-item label="预警时间">
        <Date-picker
          type="daterange"
          placement="bottom-end"
          placeholder="选择日期"
          v-model="eventForm.alertRange"></Date-picker>
      </Form-item>
      <Form-item label="层级" prop="level">
        <el-cascader
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
      <Form-item class="details_btn">
        <Button
          type="warning"
          @click="handleEventConfirm"
          icon="edit"
          :disabled="!Boolean(this.eventForm.id)">
            更新
        </Button>
        <template v-if="!Boolean(this.eventForm.type)">
          <Tooltip content="事件集合无法删除" placement="top">
            <Button
              type="error"
              @click="handleDel"
              icon="trash-a"
              :disabled="!Boolean(this.eventForm.type)">
              删除
            </Button>
          </Tooltip>
        </template>
        <template v-else>
          <Button
            type="error"
            @click="handleDel"
            icon="trash-a"
            :disabled="!Boolean(this.eventForm.type)">
            删除
          </Button>
        </template>
      </Form-item>
    </Form>
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
      }
    }
  },
  props: ['eventForm', 'treeData', 'isGroup'],
  methods: {
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
        this.$emit('fetchTree')
        this.eventForm_show = false
        this.eventAdd_modal = false
        let str = res.data.msg.split(',')
        this.$Notice.success({
          title: str[1],
          desc: str[0]
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    handleDel () {
      this.$Modal.confirm({
        title: '确认删除？',
        content: '事件：' + this.eventForm.name + ', 删除后将无法恢复',
        onOk: () => {
          this.delEventsFromServer()
        },
        onCancel: () => {
          this.$Message.info('删除取消')
        }
      })
    },
    delEventsFromServer () {
      this.$axios.post('/events/del', {id: this.eventForm.id})
        .then((res) => {
          this.$emit('fetchTree')
          let str = res.data.msg.split(',')
          this.$Notice.success({
            title: str[1],
            desc: str[0]
          })
        }).catch((err) => {
          console.log(err)
        })
    }
  },
  mounted () {
  }
}
</script>

<style lang="css">
.form .ivu-form-item-content {
  width: 500px !important;
}
</style>
