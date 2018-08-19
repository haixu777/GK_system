<template lang="html">
  <div class="home_container">
    <div class="title">
      <div class="logout_btn" @click="logout">
        <img src="../assets/back.png" width="25" height="25" alt="logout">
        <span style="display:inline-block;margin-left:5px;">注销</span>
      </div>
      <div class="username">
        {{ userName }}
      </div>
    </div>
    <div class="sysName">
      数据整理系统
    </div>
    <div class="main">
      <template v-for="item in themeList">
        <div class="theme_item" @click="handleThemeSelect(item.path)">
          <img class="item_bg" :src="item.img"></img>
          <div class="item_text">{{ item.name }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
const $utils = require('utils')
const isDev = process.env.NODE_ENV === 'development'
export default {
  data () {
    return {
      activeName: '',
      themeList: [
        { name: '事件管理', path: 'event/category', img: require('assets/event.png') },
        { name: '管控方案', path: 'control/data_entry', img: require('assets/control.png') },
        { name: '取证样本', path: 'sample/auto-extract', img: require('assets/sample.png') },
        { name: '数量统计', path: 'total', img: require('assets/total.png') }
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
        ticket: (unescape($utils.Cookie.get('ticket'))).replace(/%3D/g, '='),
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
    if (!isDev) {
      if ($utils.Cookie.get('ticket')) {
        this.fetchUserInfoByMenhu(() => {
          this.syncUserInfoFromServer()
        })
      } else {
        this.logoutMsg()
      }
    }
  }
}
</script>

<style lang="scss">
.home_container {
  height: 100%;
  background: #2a91f1;
  background-image: url('../assets/bg.png');
  .title {
    height: 40px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    padding: 30px;
    font-size: 20px;
    color: #fff;
    font-weight: bolder;
    .logout_btn {
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      cursor: pointer;
    }
  }
  .sysName {
    text-align: center;
    color: #fff;
    font-size: 30px;
    font-weight: bolder;
    letter-spacing: 3px;
    margin-top: 50px;
  }
  .main {
    height: 300px;
    width: 80%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    display: -webkit-flex;
    justify-content: space-around;
    .theme_item {
      height: 100%;
      width: 230px;
      border: 1px solid #90abcf;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      &:hover {
        border: 2px solid gray;
      }
      .item_bg {
        display: block;
        height: 130px;
        margin: 0 auto;
        margin-top: 40px;
      }
      .item_text {
        font-size: 20px;
        font-weight: bolder;
        margin-top: 30px;
        color: #515151;
      }
    }
  }
}
</style>
