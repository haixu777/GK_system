<template lang="html">
  <div class="">
    <Tag color="red" v-for="keyword in keywordsList" :key="keyword.value" closable @on-close="handleDel(keyword)">
      {{ keyword.label }}
    </Tag>
    <i-button icon="ios-plus" size="small" type="ghost" @click="handleAdd">添加</i-button>

    <Modal v-model="modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>关键词配置</span>
      </p>
      <div style="">
        <!-- <i-button type="primary" size="small" @click="handleKeywordAdd" :disabled="!(filterWord.length)">添加</i-button> -->
        <!-- <Input v-model="filterWord" icon="ios-search" placeholder="关键词搜索" style="width: 180px"></Input> -->
        <Select v-model="keywordId" remote filterable :remote-method="handleSearch" :loading="loading" placeholder="请输入搜索内容" @keyup.enter.native="handleEvent2Keyword">
          <Option v-for="keyword in searchKeywordList" :value="keyword.value" :key="keyword.value" :disabled="keyword.disabled">{{ keyword.label }}</Option>
        </Select>
      </div>
      <div slot="footer">
        <i-button type="primary" size="small" @click="handleEvent2Keyword" :disabled="!(query.length)">确认</i-button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keywordId: '',
      keywordsList: [],
      searchKeywordList: [],
      modal: false,
      data: [],
      timer: null,
      loading: true,
      query: ''
    }
  },
  props: ['eventId'],
  watch: {
    eventId (id) {
      this.fetchKeywordByEventIdFromServer(id)
    }
    // filterWord (val) {
    //   if (!val) return
    //   clearTimeout(this.timer)
    //   let _this = this
    //   this.timer = setTimeout(() => {
    //     _this.fetchKeywordsListFromServer()
    //   }, 1000)
    // }
  },
  methods: {
    fetchKeywordByEventIdFromServer () {
      this.$axios.get('/events/fetchKeywords', {
        params: {
          eventId: this.eventId
        }
      }).then((res) => {
        this.keywordsList = res.data.keywordsList
      }).catch((err) => {
        console.log(err)
      })
    },
    fetchKeywordsListFromServer () {
      this.$axios.get('/keywords/list', {
        params: {
          word: this.query,
          eventId: this.eventId
        }
      }).then((res) => {
        this.loading = false
        this.searchKeywordList = res.data.keywordsList
      }).catch((err) => {
        console.log(err)
      })
    },
    postEvent2KeywordFromServer (action, keywordId, name, keyword) {
      this.$axios.post('/keywords/event2keyword', {
        action: action,
        keywordId: keywordId,
        eventId: this.eventId,
        keyword: keyword
      }).then((res) => {
        if (res.data.success) {
          this.$Notice.success({
            title: res.data.msg
          })
        } else {
          this.$Notice.error({
            title: res.data.msg
          })
        }
        if (action === 'add') {
          this.fetchKeywordByEventIdFromServer()
        } else {
          const index = this.keywordsList.indexOf(name)
          this.keywordsList.splice(index, 1)
        }
        this.modal = false
      }).catch((err) => {
        console.log(err)
      })
    },
    handleSearch (query) {
      this.query = query
      this.loading = true
      this.searchKeywordList = []
      clearTimeout(this.timer)
      if (this.query !== '') {
        this.timer = setTimeout(() => {
          this.fetchKeywordsListFromServer()
        }, 1000)
      } else {
        this.searchKeywordList = []
      }
    },
    handleAdd () {
      this.modal = true
      this.keywordId = ''
    },
    handleEvent2Keyword () {
      this.postEvent2KeywordFromServer('add', this.keywordId, null, this.query)
    },
    handleDel (item) {
      this.postEvent2KeywordFromServer('del', item.value, item.name, null)
    }
  },
  mounted () {
    this.fetchKeywordByEventIdFromServer()
  }
}
</script>

<style lang="scss">
  .ivu-transfer {
    .ivu-transfer-list {
      text-align: left;
      min-height: 300px;
    }
  }
</style>
