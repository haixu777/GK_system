<template lang="html">
  <div class="control_manual_review">
    <div class="condition_container">
      <Select v-model="platform"
        filterable
        placeholder="平台选择"
        clearable
        style="width:176px;"
        class="handleAccount"
        @on-change="fetchAccountList">
        <Option v-for="item in platformList" :value="item.platform" :key="item.platform">
          {{ item.platform }}
        </Option>
      </Select>
    </div>
    <Table stripe border :columns="columns" :data="accountList"></Table>
    <Page
      style="float: right;"
      :total="totalItem"
      :current="currentPage"
      :page-size="perItem"
      :page-size-opts="[20, 30, 50, 100]"
      @on-change="handlePageChange"
      @on-page-size-change="handlePagesizeChange"
      show-total
      size="small"
      show-sizer>
    </Page>
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
      ],
      platformList: [],
      platform: '',
      perItem: 20,
      currentPage: 1
    }
  },
  methods: {
    fetchAccountList () {
      this.$axios.get('/handleAccount/list', {
        params: {
          perItem: Number(this.perItem),
          currentPage: this.currentPage,
          platform: this.platform
        }
      }).then((res) => {
        this.accountList = res.data.data.accountList
        this.totalItem = res.data.data.totalItem
      }).catch((err) => {
        console.log(err)
      })
    },
    handlePagesizeChange (perItem) {
      this.perItem = perItem
      this.fetchAccountList()
    },
    handlePageChange (currentPage) {
      this.currentPage = currentPage
      this.fetchAccountList()
    },
    fetchPlatformList () {
      this.$axios.get('/handleAccount/platform')
        .then((res) => {
          this.platformList = this.filter(res.data.platformList)
        }).catch((err) => {
          console.log(err)
        })
    },
    filter (data) {
      let res = []
      for (var i = 0; i < data.length; i++) {
        if (data[i].platform) {
          res.push(data[i])
        }
      }
      return res
    }
  },
  mounted () {
    this.fetchAccountList()
    this.fetchPlatformList()
  }
}
</script>

<style lang="scss">
.handleAccount {
  .ivu-select-selected-value {
  }
}
</style>
