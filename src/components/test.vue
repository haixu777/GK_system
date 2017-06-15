<template lang="html">
  <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
    <Row type="flex">
      <i-col :span="spanLeft" class="layout-menu-left">
        <Menu
        :active-name="activeName"
        :open-names="['sample', 'auto-extract']"
        theme="dark"
        width="auto"
        @on-select="handleMenuSelect">
          <div class="layout-logo-left"></div>
          <!-- <Menu-item name="1">
            <Icon type="ios-navigate" :size="iconSize"></Icon>
            <span class="layout-text">选项 1</span>
          </Menu-item>
          <Menu-item name="2">
            <Icon type="ios-keypad" :size="iconSize"></Icon>
            <span class="layout-text">选项 2</span>
          </Menu-item>
          <Menu-item name="3">
            <Icon type="ios-analytics" :size="iconSize"></Icon>
            <span class="layout-text">选项 3</span>
          </Menu-item> -->
          <Submenu name="sample">
            <template slot="title">
              <Icon type="ios-navigate"></Icon>
              取证样本
            </template>
            <Menu-item name="sample/auto-extract">待处理文件列表</Menu-item>
            <Menu-item name="sample/manual-review">抽取结果列表</Menu-item>
          </Submenu>
          <Submenu name="control">
            <template slot="title">
              <Icon type="ios-navigate"></Icon>
              管控方案
            </template>
            <Menu-item name="control/manual_review">管控方案编辑</Menu-item>
          </Submenu>
          <Submenu name="event">
            <template slot="title">
              <Icon type="ios-navigate"></Icon>
              事件管理
            </template>
            <Menu-item name="event/category">事件分类</Menu-item>
            <Menu-item name="event/calendar">事件日历</Menu-item>
          </Submenu>
        </Menu>
      </i-col>
      <i-col :span="spanRight">
        <div class="layout-header">
          <i-button type="text" @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </i-button>
        </div>
        <div class="layout-breadcrumb" style="display:none;">
          <Breadcrumb>
            <Breadcrumb-item href="#">首页</Breadcrumb-item>
            <Breadcrumb-item href="#">应用中心</Breadcrumb-item>
            <Breadcrumb-item>某应用</Breadcrumb-item>
          </Breadcrumb>
        </div>
        <div class="layout-content">
          <div class="layout-content-main">
            <router-view></router-view>
          </div>
        </div>
        <div class="layout-copy">
          2011-2016 &copy; TalkingData
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      spanLeft: 5,
      spanRight: 19,
      activeName: 'sample/auto-extract'
    }
  },
  computed: {
    iconSize () {
      return this.spanLeft === 5 ? 14 : 24
    }
  },
  methods: {
    toggleClick () {
      if (this.spanLeft === 5) {
        this.spanLeft = 2
        this.spanRight = 22
      } else {
        this.spanLeft = 5
        this.spanRight = 19
      }
    },
    handleMenuSelect (path) {
      this.$router.replace('manual-review')
    }
  },
  mounted () {
    this.$router.replace('/sample/auto-extract')
  }
}
</script>

<style scoped>
  .layout{
    text-align: left;
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-breadcrumb{
    padding: 10px 15px 0;
  }
  .layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
  .layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
  .layout-menu-left{
    background: #464c5b;
  }
  .layout-header{
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
  .layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }
  .layout-ceiling-main a{
    color: #9ba7b5;
  }
  .layout-hide-text .layout-text{
    display: none;
  }
  .ivu-col{
    transition: width .2s ease-in-out;
  }
</style>
