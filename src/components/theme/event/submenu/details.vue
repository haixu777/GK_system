<template lang="html">
  <div class="">
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
      <Form-item label="危害等级" prop="harm_level">
        <Slider v-model="eventForm.harm_level" :max="3" :show-input="true" :show-stops="true"></Slider>
      </Form-item>
      <!-- <Form-item label="类型" prop="type">
        <Radio-group v-model="eventForm.type">
          <Radio label="0">
            <span>根结点</span>
          </Radio>
          <Radio label="1">
            <span>叶子节点</span>
          </Radio>
        </Radio-group>
      </Form-item> -->
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
        <Date-picker type="date" placeholder="选择日期" style="width: 200px" v-model="eventForm.occurrence_time"></Date-picker>
      </Form-item>
      <Form-item label="预警时间">
        <Date-picker
          type="daterange"
          placement="bottom-end"
          placeholder="选择日期"
          style="width: 200px"
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
      <Form-item>
        <Button
          type="warning"
          @click="handleEventConfirm"
          icon="edit"
          :disabled="!Boolean(this.eventForm.id)">
            更新
        </Button>
        <Button
          type="error"
          icon="trash-a"
          :disabled="!Boolean(this.eventForm.id)">
            删除
        </Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: ['eventForm', 'defaultProps', 'treeData'],
  methods: {
    handleEventConfirm () {
      this.$axios.post('/events/update', {
        id: this.eventForm.id,
        name: this.eventForm.name,
        parent_id: this.eventForm.level[-1],
        descript: this.eventForm.descript,
        occurrence_time: this.eventForm.occurrence_time,
        type: this.eventForm.type,
        level: this.eventForm.level,
        edit_time: this.eventForm.edit_time,
        harm_level: this.eventForm.harm_level,
        recurrence: this.eventForm.recurrence,
        alertRange: this.eventForm.alertRange
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
    fetchEventsTreeFromServer () {
      this.$axios.get('/events/tree')
        .then((res) => {
          this.treeData = res.data.tree
        }).catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="css">
</style>
