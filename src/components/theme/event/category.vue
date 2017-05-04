<template lang="html">
  <div class="category clearfix">
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
    <div class="category_content">
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
        <Form-item label="发生时间" prop="occurrence_time">
          <Date-picker type="date" placeholder="选择日期" style="width: 200px" v-model="eventForm.occurrence_time"></Date-picker>
        </Form-item>
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
          <Slider v-model="eventForm.harm_level" :max="5" :show-input="true" :show-stops="true"></Slider>
          <!-- <el-slider v-model="eventForm.harm_level" :max="2" show-input></el-slider> -->
        </Form-item>
        <Form-item label="类型" prop="type">
          <Radio-group v-model="eventForm.type">
            <Radio label="0">
              <span>根结点</span>
            </Radio>
            <Radio label="1">
              <span>叶子节点</span>
            </Radio>
          </Radio-group>
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
          <Button type="success" @click="resetEventForm">添加新事件</Button>
          <Button type="warning" @click="handleEventConfirm">确认</Button>
          <!-- <Button type="error" icon="trash-a">删除</Button> -->
        </Form-item>
      </Form>
    </div>
  </div>
</template>

<script>
const $utils = require('utils')
export default {
  data () {
    return {
      filterText: '',
      eventForm: {
        id: '',
        name: '',
        parent_id: '',
        descript: '',
        occurrence_time: '',
        level: [],
        type: 0,
        edit_time: '',
        harm_level: 0
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      }
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
      return data.label.indexOf(value) !== -1
    },
    handleEventClick (node) {
      this.eventForm = {
        id: node.id,
        name: node.name,
        parent_id: node.parent_id,
        descript: node.descript,
        occurrence_time: node.occurrence_time,
        type: node.type,
        level: $utils.formatEventLevel(node.level),
        edit_time: node.edit_time,
        harm_level: node.harm_level
      }
      console.log(this.eventForm)
    },
    fetchEventsTreeFromServer () {
      this.$axios.get('/events/tree')
        .then((res) => {
          console.log(res)
          this.treeData = res.data.tree
        }).catch((err) => {
          console.log(err)
        })
    },
    resetEventForm () {
      this.eventForm = {}
    },
    handleEventConfirm () {
      this.$axios.post('/events/update', {
        id: this.eventForm.id,
        name: this.eventForm.name,
        parent_id: this.eventForm.parent_id,
        descript: this.eventForm.descript,
        occurrence_time: this.eventForm.occurrence_time,
        type: this.eventForm.type,
        level: $utils.formatEventLevel(this.eventForm.level),
        edit_time: this.eventForm.edit_time,
        harm_level: this.eventForm.harm_level
      }).then((res) => {
        console.log(res)
        this.fetchEventsTreeFromServer()
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.fetchEventsTreeFromServer()
  }
}
</script>

<style lang="scss">
  .category {
    box-sizing: border-box !important;
    text-align: left;
    >div {
      display: inline-block;
      float: left;
    }
    .category_tree {
    }
    .category_content {
      width: 70%;
      margin-left: 4%;
      border: 1px solid #d1dbe5;
      .ivu-input-group {
        width: 35% !important;
      }
      .ivu-form-item-content {
        width: 200px;
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
