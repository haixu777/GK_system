<template lang="html">
  <div class="sample">
    <Menu mode="horizontal" :theme="'dark'" :active-name="activeName" @on-select="handleMenuSelect">
      <Menu-item name="home">
        <Icon type="ios-home"></Icon>
        首页
      </Menu-item>
      <!-- <Menu-item name="data-entry">
        <Icon type="ios-paper"></Icon>
        待处理文件列表
      </Menu-item> -->
      <Menu-item name="auto-extract">
        <Icon type="ios-people"></Icon>
        待处理文件列表
      </Menu-item>
      <Menu-item name="manual-review">
        <Icon type="settings"></Icon>
        抽取结果列表
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
        this.$router.push('/sample/' + path)
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

<style lang="css">
</style>
