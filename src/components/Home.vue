<template lang="html">
  <div class="home">
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
export default {
  data () {
    return {
      activeName: '',
      themeList: [
        { name: '取证样本', path: 'sample/auto-extract' },
        { name: '管控方案', path: 'control/auto_extract' },
        { name: '事件管理', path: 'event/category' }
      ]
    }
  },
  methods: {
    handleThemeSelect (path) {
      this.$router.push(path)
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
