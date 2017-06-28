<template lang="html">
  <div class="event">
    <Menu mode="horizontal" :theme="'dark'" :active-name="activeName" @on-select="handleMenuSelect">
      <!-- <Menu-item name="calendar">
        <Icon type="ios-paper"></Icon>
        事件日历
      </Menu-item> -->
      <span style="color:#fff;font-size:20px;font-weight:600;">事件日历系统</span>
      <div class="" style="position:absolute;top:0;right:30px;">
        <i-button type="primary" size="small" @click="logout">注销</i-button>
      </div>
    </Menu>
    <div class="event_content clearfix">
      <!-- <router-view></router-view> -->
      <calendar></calendar>
    </div>
  </div>
</template>

<script>
const Calendar = require('@/components/theme/event/calendar')
const $utils = require('utils')
export default {
  data () {
    return {
      activeName: this.$router.currentRoute.name
      /*
      mainTopic_id: '',
      topic1_id: '',
      topic2_id: '',
      event_id: '',
      node: {},
      formValidate: {
        name: '',
        descript: '',
        harm_level: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '该名称不能为空', trigger: 'blur' }
        ]
      }
      */
    }
  },
  components: {
    Calendar
  },
  methods: {
    handleMenuSelect (path) {
      if (path === 'home') {
        this.$router.push('/' + path)
      } else {
        this.$router.push('/event/' + path)
      }
    },
    handleSubMenuSelect (path) {
      this.activeName = path
    },
    logout () {
      this.$router.push('login')
      $utils.Cookie.del('login')
      $utils.Cookie.del('isAdmin')
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss">
  .event_content {
    padding: 5px;
    background: #fff;
  }
</style>
