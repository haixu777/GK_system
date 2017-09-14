<template lang="html">
  <div class="handleAccount">
    <div class="handleList_container">
      <Table stripe border :columns="columns" :data="accountList"></Table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      accountList: [],
      columns: [
        {
          title: '账号名称',
          key: 'name'
        },
        {
          title: '平台',
          key: 'platform'
        },
        {
          title: '操作',
          key: 'operation'
        }
      ]
    }
  },
  methods: {
    fetchAccountList () {
      this.$axios.get('/handleAccount/list')
        .then((res) => {
          console.log(res)
          this.accountList = res.data.data.accountList
        }).catch((err) => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.fetchAccountList()
  }
}
</script>

<style lang="scss">
.handleAccount {
  .handleList_container {
    width: 60%;
    margin: 10px auto;
  }
}
</style>
