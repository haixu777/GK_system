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
        { name: '取证样本', path: 'sample/auto-extract' },
        { name: '管控方案', path: 'control/manual_review' },
        { name: '事件管理', path: 'event/category' }
      ],
      userName: this.$store.state.userName
    }
  },
  methods: {
    fetchUserInfoFromMenhu () {
      this.$axios.post('http://10.136.88.96:8080/menhu/authUser/getUserResourceOther', {
        ticket: unescape($utils.Cookie.get('ticket')),
        clientIP: '127.0.0.1',
        appSysID: '237'
      }).then((res) => {
        console.log(res.data)
      }).catch((err) => {
        console.log(err)
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
    this.fetchUserInfoFromMenhu()
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
