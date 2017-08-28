<template lang="html">
<!--
  <div class="home">
    <Menu mode="horizontal" :theme="'dark'" :active-name="activeName" @on-select="handleMenuSelect">
      <Menu-item name="calendar">
        <Icon type="ios-paper"></Icon>
        事件日历
      </Menu-item>
      <span style="color:#fff;font-size:20px;font-weight:600;">数据整理系统</span>
      <div class="" style="position:absolute;top:0;right:30px;">
        <span style="color: #fff;">{{ userName }}</span>
        <i-button type="primary" size="small" @click="logout">注销</i-button>
      </div>
    </Menu>
    <div class="theme">
      <template v-for="item in themeList">
        <div class="theme_item" @click="handleThemeSelect(item.path)">
          <Card style="width:200px">
            <div style="text-align:center">
              <h3>{{ item.name }}</h3>
            </div>
          </Card>
        </div>
      </template>
    </div>
  </div>
-->
  <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
      <Row type="flex">
          <Col :span="spanLeft" class="layout-menu-left">
              <Menu active-name="1" theme="dark" width="auto" :accordion="true" @on-select="menuSelect">
                  <div class="layout-logo-left">数据整理系统</div>
                  <Submenu name="1">
                      <template slot="title">
                          <Icon type="ios-navigate"></Icon>
                          取证样本
                      </template>
                      <MenuItem name="/sample/auto-extract">待处理文件列表</MenuItem>
                      <MenuItem name="/sample/manual-review">抽取结果列表</MenuItem>
                  </Submenu>
                  <Submenu name="2">
                      <template slot="title">
                          <Icon type="ios-navigate"></Icon>
                          管控方案
                      </template>
                      <MenuItem name="/control/manual_review">管控方案编辑</MenuItem>
                  </Submenu>
                  <Submenu name="3">
                    <template slot="title">
                        <Icon type="ios-navigate"></Icon>
                        事件管理
                    </template>
                    <MenuItem name="/event/category">事件分类</MenuItem>
                    <MenuItem name="/event/calendar">事件日历</MenuItem>
                  </Submenu>
              </Menu>
          </Col>
          <Col :span="spanRight">
              <div class="layout-header">
                  <Button type="text" @click="toggleClick">
                      <Icon type="navicon" size="32"></Icon>
                  </Button>
                  <div style="display:inline-block;display:flex;justify-content:center;align-items:center;margin-right:10px;">
                    <span style="">{{ userName }}</span>
                    <i-button type="primary" size="small" @click="logout">注销</i-button>
                  </div>
              </div>
              <div class="layout-content">
                  <div class="layout-content-main">
                    <router-view></router-view>
                  </div>
              </div>
              <div class="layout-copy">
                  2011-2016 &copy; TalkingData
              </div>
          </Col>
      </Row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: '',
      themeList: [
        { name: '取证样本', path: 'sample/auto-extract' },
        { name: '管控方案', path: 'control/manual_review' },
        { name: '事件管理', path: 'event/category' }
      ],
      userName: this.$store.state.userName,
      spanLeft: 5,
      spanRight: 19
    }
  },
  computed: {
    iconSize () {
      return this.spanLeft === 5 ? 14 : 24
    }
  },
  methods: {
    handleThemeSelect (path) {
      this.$router.replace(path)
    },
    handleMenuSelect () {
      console.log(111)
    },
    logout () {
      this.$store.commit('logout')
    },
    toggleClick () {
      if (this.spanLeft === 5) {
        this.spanLeft = 2
        this.spanRight = 22
      } else {
        this.spanLeft = 5
        this.spanRight = 19
      }
    },
    menuSelect (name) {
      this.$router.push(name)
    }
  },
  mounted () {
    this.$Notice.destroy()
  }
}
</script>

<style lang="scss" scoped>
  .home {
    height: 100%;
    .theme {
      margin-top: 200px;
      .theme_item {
        display: inline-block;
        margin: 10px;
        :hover {
          cursor: pointer;
        }
      }
    }
  }
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
    min-height: 600px;
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
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
  }
  .layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
    text-align: center;
    line-height: 2rem;
    color: #fff;
  }
  .layout-ceiling-main a{
    color: #9ba7b5;
  }
  .layout-hide-text .layout-text{
    display: none;
  }
  .ivu-col{
    transition: width .2s ease-in-out;
    height: inherit !important;
  }
</style>
