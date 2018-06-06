<template lang="html">
  <div class="total">
    <Menu mode="horizontal" :theme="'dark'" :active-name="activeName" @on-select="handleMenuSelect">
      <Menu-item name="home">
        <Icon type="ios-home"></Icon>
        首页
      </Menu-item>
      <Menu-item name="total">
        <Icon type="settings"></Icon>
        数量统计
      </Menu-item>
      <div class="" style="position:absolute;top:0;right:30px;">
        <span style="color: #fff;">{{ userName }}</span>
        <i-button type="primary" size="small" @click="logout">注销</i-button>
      </div>
    </Menu>
    <div class="content">
      <div class="condition_container">
        <Select v-model="event_id"
          filterable
          placeholder="事件筛选"
          clearable
          style="width:200px;"
          class=""
          @on-change="fetchCountList">
          <Option v-for="item in eventList" :value="item.value" :key="item.value">
            {{ item.text }}
          </Option>
        </Select>
        <Date-picker
          class="condition_datePicker"
          style="display: inline-block;width:180px;"
          type="daterange"
          placeholder="选择日期"
          v-model="time_range"
          confirm
          @on-ok="fetchCountList">
        </Date-picker>
      </div>
      <div class="title">
        <button class="card" :class="{ active: activeClassName == item.name, hover: item.num != '无数据'}" :disabled="item.num == '无数据'" v-for="item in countList" @click="handleItemClick(item)">
          <div class="name">{{ item.name }}</div>
          <div class="number">
            <template v-if="item.num">
              {{ item.num }}
            </template>
            <template v-else>
              <img style="width:30px;height:30px;" :src="require('assets/loading.gif')" alt="loading">
            </template>
          </div>
        </button>
      </div>
      <div class="item_content" style="text-align:left;">
        <component v-bind:is="activeItem" :content="content"></component>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: this.$router.currentRoute.name,
      userName: this.$store.state.userName,
      activeClassName: null,
      activeItem: null,
      activeNumber: 0,
      eventList: [],
      event_id: null,
      time_range: [],
      content: null,
      countList: [
        { name: '关键词', key: 'keyword', num: null },
        { name: '样本', key: 'sample', num: null },
        { name: '账号', key: 'account', num: null },
        { name: '个人', key: 'person', num: null },
        { name: '网站', key: 'website', num: null },
        { name: '群体', key: 'group', num: null },
        { name: '事件', key: 'events', num: null },
        { name: '案例', key: 'anli', num: null },
        { name: '台账', key: 'taizhang', num: null },
        { name: '方案', key: 'control', num: null }
      ]
    }
  },
  components: {
    keyword: require('./component/keyword'),
    sample: require('./component/sample'),
    account: require('./component/account'),
    anli: require('./component/anli'),
    control: require('./component/control'),
    events: require('./component/events'),
    group: require('./component/group'),
    person: require('./component/person'),
    taizhang: require('./component/taizhang'),
    website: require('./component/website')
  },
  methods: {
    handleMenuSelect (path) {
      if (path === 'home') {
        this.$router.push('/' + path)
      } else {
        this.$router.push('/total')
      }
    },
    logout () {
      this.$store.commit('logout')
    },
    handleItemClick (item) {
      this.activeClassName = item.name
      this.activeItem = item.key
      this.fetchCountItem(item.key)
    },
    countClear () {
      this.countList.forEach((item) => {
        item.num = null
      })
      this.content = []
    },
    fetchEventList () {
      this.$axios.get('/control/fetchEventListForControl')
        .then((res) => {
          this.eventList = res.data.eventsList
        }).catch((err) => {
          console.log(err)
        })
    },
    fetchCountItem (key) {
      this.content = []

      this.$axios.get('/total/item', {
        params: {
          key: key,
          eventId: this.event_id,
          time_start: this.time_range[0],
          time_end: this.time_range[1]
        }
      }).then((res) => {
        this.content = res.data.data
      }).catch((err) => {
        console.log(err)
      })
    },
    fetchCountList () {
      this.countClear()
      this.countList.forEach((item, index) => {
        this.$axios.get('/total/list', {
          params: {
            key: item.key,
            eventId: this.event_id,
            time_start: this.time_range[0],
            time_end: this.time_range[1]
          }
        }).then((res) => {
          let num = null
          if (res.data.data === 0) {
            num = '无数据'
          } else {
            num = res.data.data
          }
          this.countList[index].num = num
        }).catch((err) => {
          console.log(err)
        })
      })
      if (this.activeItem) {
        this.fetchCountItem(this.activeItem)
      }
    }
  },
  mounted () {
    this.fetchCountList()
    this.fetchEventList()
  }
}
</script>

<style lang="scss">
.total {
  .content {
    // background: #f0f2f5;
    .title {
      display: flex;
      display: -webkit-flex;
      .active {
        background: #5cadff !important;
        .name {
          color: #fff !important;
        }
        .number {
          color: #fff !important;
        }
      }
      .disable {
        &:hover {

        }
      }
      .hover {
        &:hover {
          background: #5cadff;
          .name {
            color: #fff !important;
          }
          .number {
            color: #fff !important;
          }
        }
      }
      .card {
        outline: none;
        transition: all 0.38s ease-out;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
        background: #F2F6FC;
        width: 500px;
        border: 1px solid #dfe6ec;
        border-radius: 5px;
        margin: 5px;
        padding: 10px 0 5px 0;
        .name {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .number {
          font-size: 20px;
          color: #666;
          font-weight: 600;
        }
      }
    }
    .item_content {
      background: #F2F6FC;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      border: 1px solid #dfe6ec;
      border-radius: 5px;
      padding: 10px;
      margin: 5px;
    }
  }
}
</style>
