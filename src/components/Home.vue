<template lang="html">
  <div class="home">
    <Menu mode="horizontal" :theme="'dark'" :active-name="activeName" @on-select="handleMenuSelect">
      <!-- <Menu-item name="calendar">
        <Icon type="ios-paper"></Icon>
        事件日历
      </Menu-item> -->
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
</template>

<script>
const $utils = require('utils')
export default {
  data () {
    return {
      activeName: '',
      themeList: [
        { name: '事件管理', path: 'event/category' },
        { name: '管控方案', path: 'control/manual_review' },
        { name: '取证样本', path: 'sample/auto-extract' }
      ],
      userName: this.$store.state.userName,
      userAuth: unescape($utils.Cookie.get('userAuth')),
      deptName: unescape($utils.Cookie.get('deptName')),
      userAccount: null,
      deptId: null,
      show: false
    }
  },
  methods: {
    fetchUserInfoByMenhu (cb) {
      this.$axios.post('http://10.136.88.96:8080/menhu/authUser/getUserResourceOther', {
        ticket: (unescape($utils.Cookie.get('ticket'))).replace('%3D', '='),
        clientIP: '127.0.0.1',
        appSysID: '237'
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
          cb()
        } else {
          this.logoutMsg()
        }
      }).catch((err) => {
        console.log(err)
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
    logoutMsg () {
      this.$Modal.error({
        title: '登录信息过期',
        content: '请注销并重新登录',
        okText: '注销',
        onOk: () => {
          this.logout()
        }
      })
    },
    handleThemeSelect (path) {
      this.$router.push(path)
    },
    handleMenuSelect () {
      console.log(111)
    },
    logout () {
      this.$store.commit('logout')
    }
  },
  mounted () {
    this.$Notice.destroy()
    if ($utils.Cookie.get('ticket')) {
      this.fetchUserInfoByMenhu(() => {
        this.syncUserInfoFromServer()
      })
    } else {
      this.logoutMsg()
    }
  }
}
</script>

<style lang="scss">
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
</style>
