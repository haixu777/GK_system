<template lang="html">
  <div class="control">
    <Menu mode="horizontal" :theme="'dark'" :active-name="activeName" @on-select="handleMenuSelect">
      <Menu-item name="home">
        <Icon type="ios-home"></Icon>
        首页
      </Menu-item>
      <!-- <Menu-item name="data_entry">
        <Icon type="ios-paper"></Icon>
        管控方案编辑
      </Menu-item> -->
      <!-- <Menu-item name="auto_extract">
        <Icon type="ios-people"></Icon>
        管控方案编辑
      </Menu-item> -->
      <Menu-item name="manual_review">
        <Icon type="settings"></Icon>
        管控历史
      </Menu-item>
      <Menu-item name="account_handle">
        <Icon type="settings"></Icon>
        处置账号
      </Menu-item>
      <Menu-item name="taizhang">
        <Icon type="settings"></Icon>
        台账历史
      </Menu-item>
      <Menu-item name="statistics">
        <Icon type="settings"></Icon>
        统计汇总
      </Menu-item>
      <div class="" style="position:absolute;top:0;right:30px;">
        <span style="color: #fff;">{{ userName }}</span>
        <i-button type="primary" size="small" @click="logout">注销</i-button>
      </div>
    </Menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: this.$router.currentRoute.name,
      userName: this.$store.state.userName
    }
  },
  methods: {
    handleMenuSelect (path) {
      if (path === 'home') {
        this.$router.push('/' + path)
      } else {
        this.$router.push('/control/' + path)
      }
    },
    logout () {
      this.$store.commit('logout')
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss">
</style>
