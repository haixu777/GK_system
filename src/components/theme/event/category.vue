<template lang="html">
  <div class="category clearfix">
    <div class="category_tree">
      <i-button
        type="primary"
        icon="ios-plus"
        style="width:100%;"
        @click="handleEventAdd">
          添加
      </i-button>
      <Input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </Input>
      <el-tree
        :data="treeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :render-content="renderTree"
        style="min-width: 120px;"
        ref="tree"
        @node-click="handleEventClick"
        :empty-text="'事件加载中...'"
        :highlight-current="true">
      </el-tree>
    </div>
    <div class="category_content" v-if="eventForm.id">
      <div class="submenu">
        <Menu :active-name="activeMenu" @on-select="handleMenuSelect">
          <Menu-group :title="activeEvent">
            <Menu-item name="details">
              <Icon type="ios-cog"></Icon>
              事件概述
            </Menu-item>
            <Menu-item name="procedure">
              <Icon type="bug"></Icon>
              事件流程图
            </Menu-item>
            <Menu-item name="keywords">
              <Icon type="bug"></Icon>
              事件关键词
            </Menu-item>
            <Menu-item name="account">
              <Icon type="social-twitter"></Icon>
              相关账号
            </Menu-item>
            <!--
            <Menu-item name="person">
              <Icon type="android-person"></Icon>
              相关人物
            </Menu-item>
            <Menu-item name="platform">
              <Icon type="earth"></Icon>
              相关平台
            </Menu-item>
            <Menu-item name="group">
              <Icon type="ios-people"></Icon>
              相关组织
            </Menu-item>
          -->
            <Menu-item name="control">
              <Icon type="ios-people"></Icon>
              管控记录
            </Menu-item>
            <Menu-item name="sample">
              <Icon type="ios-people"></Icon>
              相关样本
            </Menu-item>
          </Menu-group>
        </Menu>
      </div>
      <div class="content">
        <category-details
          v-if="activeMenu === 'details'"
          :eventForm="eventForm"
          :defaultProps="defaultProps"
          :treeData="treeData"
          :isGroup="true"
          @fetchTree="fetchEventsTreeFromServer">
          </category-details>
          <category-procedure
            v-if="activeMenu === 'procedure'"
            :eventId="eventForm.id">
          </category-procedure>
          <category-keywords
            v-if="activeMenu === 'keywords'"
            :eventId="eventForm.id">
          </category-keywords>
          <category-persons
            v-if="activeMenu === 'person'"
            :eventId="eventForm.id">
          </category-persons>
          <category-platform
            v-if="activeMenu === 'platform'"
            :eventId="eventForm.id">
          </category-platform>
          <category-account
            v-if="activeMenu === 'account'"
            :eventId="eventForm.id">
          </category-account>
          <category-group
            v-if="activeMenu === 'group'"
            :eventId="eventForm.id">
          </category-group>
          <category-control
           v-if="activeMenu === 'control'"
           :showEvent="false"
           :eventId="eventForm.id">
          </category-control>
          <category-sample
           v-if="activeMenu === 'sample'"
           :showKeyword="1"
           :showEvent="false"
           :eventId="eventForm.id">
          </category-sample>
      </div>
    </div>

    <Modal v-model="eventAdd_modal" width="800">
      <p slot="header" style="color:#39f;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>事件添加</span>
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
              :rows="4"
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
          <Form-item label="备注" prop="name">
            <Input v-model="eventForm.remark" placeholder="请输入备注"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="handleEventConfirm">添加</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
const $utils = require('utils')
const categoryDetails = require('./submenu/details')
const categoryKeywords = require('./submenu/keywords')
const categoryPersons = require('./submenu/person')
const categoryPlatform = require('./submenu/platform')
const categoryProcedure = require('./processUpload')
const categoryAccount = require('./submenu/account')
const categoryGroup = require('./submenu/group')
const categoryControl = require('../control/manual_review')
const categorySample = require('../sample/manual_review')
export default {
  data () {
    return {
      filterText: '',
      eventForm: {
        id: null,
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
      activeEvent: '',
      activeMenu: 'details',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      eventForm_show: false,
      eventAdd_modal: false
    }
  },
  components: {
    categoryDetails,
    categoryKeywords,
    categoryPersons,
    categoryPlatform,
    categoryProcedure,
    categoryAccount,
    categoryGroup,
    categoryControl,
    categorySample
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
      this.activeEvent = node.name
      this.eventForm_show = true
      this.eventForm = {
        id: node.id,
        name: node.name,
        parent_id: node.parent_id,
        descript: node.descript,
        occurrence_time: node.occurrence_time,
        type: node.type,
        level: $utils.formatEventLevel(node.level),
        edit_time: node.edit_time,
        harm_level: node.harm_level,
        recurrence: node.recurrence,
        alertRange: node.alertRange,
        category: node.category,
        remark: node.remark
      }
    },
    fetchEventsTreeFromServer () {
      this.$axios.get('/events/tree')
        .then((res) => {
          this.treeData = res.data.tree
          this.eventForm.id = null
          this.handleEventClick({
            id: 1,
            name: '自然灾害及公共安全事件',
            parent_id: null,
            descript: null,
            occurrence_time: null,
            type: 0,
            level: '0',
            recurrence: 0,
            harm_level: 1,
            alertRange: [],
            category: 1,
            remark: ''
          })
        }).catch((err) => {
          console.log(err)
        })
    },
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
        alertRange: this.eventForm.alertRange,
        category: this.eventForm.category,
        remark: this.eventForm.remark
      }).then((res) => {
        this.fetchEventsTreeFromServer()
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
    handleEventAdd () {
      this.eventAdd_modal = true
      this.eventForm_show = false
      this.eventForm = {
        id: '',
        name: '',
        parent_id: '',
        descript: '',
        occurrence_time: new Date(),
        level: [],
        type: 0,
        edit_time: new Date(),
        harm_level: 0,
        recurrence: 0,
        alertRange: [],
        category: 1,
        remark: ''
      }
    },
    console1 (str) {
      console.log(str)
    },
    handleMenuSelect (name) {
      this.activeMenu = name
    },
    renderTree (h, { node, data, store }) {
      if (data.disabled) {
        return (
          <span class="">
            <i class="ivu-icon ivu-icon-document"></i>
            <span style="margin-left:5px;">{data.name}</span>
          </span>
        )
      } else {
        return (
          <span class="">
            <i class="ivu-icon ivu-icon-folder"></i>
            <span style="margin-left:5px;">{data.name}</span>
          </span>
        )
      }
    }
  },
  mounted () {
    this.fetchEventsTreeFromServer()
    this.$Notice.destroy()
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
      width: 25%;
    }
    .category_content {
      width: 74%;
      margin-left: 1%;
      margin-top: 25px;
      border: 1px solid #d1dbe5;
      display: box;
      display: -webkit-box;
      display: -moz-box;

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
