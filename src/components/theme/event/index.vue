<template lang="html">
  <div class="event">
    <Menu mode="horizontal" :theme="'dark'" :active-name="activeName" @on-select="handleMenuSelect">
      <Menu-item name="home">
        <Icon type="ios-home"></Icon>
        首页
      </Menu-item>
      <Menu-item name="category">
        <Icon type="ios-paper"></Icon>
        事件分类
      </Menu-item>
      <Menu-item name="calendar">
        <Icon type="ios-paper"></Icon>
        事件日历
      </Menu-item>
    </Menu>
    <div class="event_content clearfix">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
const Tree = require('./Tree')
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
    Tree
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
    fetchEventsTree () {
      this.$axios.get('/events/getTree')
        .then((res) => {
          this.treeData = res.data.tree
        }).catch((err) => {
          console.log(err)
        })
    },
    handleUpdateToServer () {
      this.$axios.post('/events/update', {
        mainTopic_id: this.mainTopic_id,
        topic1_id: this.topic1_id,
        topic2_id: this.topic2_id,
        event_id: this.event_id,
        name: this.formValidate.name,
        descript: this.formValidate.descript,
        harm_level: this.formValidate.harm_level
      }).then((res) => {
        if (res.data.success) {
          this.$Message.success((this.event_id ? '事件' : '主题') + '修改成功')
          this.fetchEventsTree()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleNodeClick (node) {
      this.topic1_id = node.topic1_id
      this.topic2_id = node.topic2_id
      this.event_id = node.event_id
      this.mainTopic_id = node.mainTopic_id
      this.formValidate = {
        name: node.name,
        descript: node.descript,
        harm_level: node.harm_level
      }
    }
  },
  mounted () {
    // this.fetchEventsTree()
  }
}
</script>

<style lang="scss">
  .event_content {
    padding: 5px;
    background: #fff;
  }
</style>
