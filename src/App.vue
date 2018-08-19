<template>
  <div id="app" class="event">
    <Menu mode="horizontal" :theme="'dark'" :active-name="activeName" @on-select="handleMenuSelect">
      <!-- <Menu-item name="calendar">
        <Icon type="ios-paper"></Icon>
        事件日历
      </Menu-item> -->
      <div class="" style="position:absolute;top:0;left:30px;">
        <i-button type="primary" size="small" @click="handleMytag">
          {{ !taggleView ? '我的日历' : '我的标签' }}
        </i-button>
      </div>
      <span style="color:#fff;font-size:20px;font-weight:600;">舆情事件日历系统</span>
      <div class="" style="position:absolute;top:0;right:30px;">
        <span style="color: #fff;" >
          <Icon type="person"></Icon>
          {{ userAuth + ':' + userName }}
        </span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span style="color: #fff;" >
          <Icon type="ios-home"></Icon>
          {{ deptName }}
        </span>
        <i-button type="primary" size="small" @click="logout">注销</i-button>
      </div>
    </Menu>
    <div class="event_content clearfix">
      <router-view v-if="show"></router-view>
      <!-- <calendar></calendar> -->
    </div>
  </div>
</template>

<script>
// const Calendar = require('@/components/theme/event/calendar')
const isDev = process.env.NODE_ENV === 'development'
const $utils = require('utils')
export default {
  data () {
    return {
      activeName: this.$router.currentRoute.name,
      userAuth: unescape($utils.Cookie.get('userAuth')),
      userName: unescape($utils.Cookie.get('userName')),
      deptName: unescape($utils.Cookie.get('deptName')),
      userAccount: null,
      deptId: null,
      show: false,
      taggleView: true
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
    // Calendar
  },
  methods: {
    fetchUserInfoByMenhu (cb) {
      this.$axios.post('http://10.136.88.96:8080/menhu/authUser/getUserResourceOther', {
        ticket: (unescape($utils.Cookie.get('ticket'))).replace(/%3D/g, '='),
        clientIP: '127.0.0.1',
        appSysID: '236'
      }).then((res) => {
        if (res.data.success) {
          this.userId = res.data.info.userId
          this.userName = res.data.info.realName
          this.deptName = res.data.info.deptName
          this.deptId = res.data.info.deptId
          this.userAuth = res.data.info.userAuth
          this.userAccount = res.data.info.userAccount
          $utils.Cookie.set('userName', res.data.info.realName)
          $utils.Cookie.set('deptName', res.data.info.deptName)
          $utils.Cookie.set('userAuth', res.data.info.userAuth)
          $utils.Cookie.set('userId', res.data.info.userId)
          this.show = true
          cb()
        } else {
          this.logoutMsg()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    logoutMsg () {
      this.show = false
      this.$Modal.error({
        title: '登录信息过期',
        content: '请注销并重新登录',
        okText: '注销',
        onOk: () => {
          this.logout()
        }
      })
    },
    syncUserInfoFromServer () {
      this.$axios.post('/user_wxb/update', {
        id: this.userId,
        real_name: this.userName,
        user_account: this.userAccount,
        dept_id: this.deptId,
        dept_name: this.deptName,
        auth: this.userAuth
      }).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
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
    handleMytag () {
      if (this.taggleView) {
        this.$router.push({path: '/mytags'})
      } else {
        this.$router.push({path: '/calendar'})
      }
      this.taggleView = !this.taggleView
      this.$Notice.destroy()
    },
    logout () {
      $utils.Cookie.del('realName')
      $utils.Cookie.del('isAdmin')
      let a = document.createElement('a')
      // 测试环境
      // a.href = 'http://10.136.89.98/logout'
      // 正式环境
      a.href = 'http://10.136.89.74/logout'
      a.click()
    }
  },
  mounted () {
    if (!isDev) {
      if ($utils.Cookie.get('ticket')) {
        this.fetchUserInfoByMenhu(() => {
          this.syncUserInfoFromServer()
        })
      } else {
        this.logoutMsg()
      }
    } else {
      this.show = true
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*background: url('./assets/bg.jpg');*/
}
.ivu-menu-dark {
  background: #464c5b !important;
}
.clearfix {
  overflow:auto;
  _height:1%
}
* {
  -box-sizing: inherit !important;
}
.condition_container {
  padding: 5px;
  text-align: left;
}
.event_content {
  padding: 5px;
  background: #fff;
}
</style>
