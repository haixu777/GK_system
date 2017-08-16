<template lang="html">
  <div class="event">
    <Menu mode="horizontal" :theme="'dark'" :active-name="activeName" @on-select="handleMenuSelect">
      <!-- <Menu-item name="calendar">
        <Icon type="ios-paper"></Icon>
        事件日历
      </Menu-item> -->
      <span style="color:#fff;font-size:20px;font-weight:600;">事件日历系统</span>
      <div class="" style="position:absolute;top:0;right:30px;">
        <span style="color: #fff;">{{ userName }}</span>
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
      activeName: this.$router.currentRoute.name,
      userName: null
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
    fetchUserInfoByMenhu () {
      this.$axios.get('/menhuGroupData')
        .then((res) => {
          console.log(res)
        })
    },
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
      $utils.Cookie.del('realName')
      $utils.Cookie.del('isAdmin')
      let a = document.createElement('a')
      a.href = 'http://10.136.89.98/logout'
      a.click()
    }
  },
  mounted () {
    this.fetchUserInfoByMenhu()
    this.userName = decodeURIComponent($utils.Cookie.get('realName'))
  }
}
</script>

<style lang="scss">
  .event_content {
    padding: 5px;
    background: #fff;
  }
</style>
