<template lang="html">
  <div class="">
    <Card style="margin:5px;" v-for="group in groupList" :key="group">
      <p slot="title" style="color:#f90;">
        <Icon type="ios-person"></Icon>
        {{ group.name }}
      </p>
      <a href="#" slot="extra" @click.prevent="handleLoadPerson(group.id)">
        <Icon type="ios-loop-strong"></Icon>
        信息加载
      </a>
      <template v-if="group.id === activeId">
        <template v-if="personList[group.name].length !== 0">
          <Card style="width:300px;display:inline-block;margin:5px;" v-for="person in personList[group.name]" :key="person">
            <p slot="title" style="color:#f90;">
              <Icon type="ios-person"></Icon>
              {{ person.name }}
            </p>
            <p><b>性别</b>: {{ person.gender }}</p>
            <p><b>出生</b>: {{ person.birthdate }}</p>
            <p><b>籍贯</b>: {{ person.nativeplace }}</p>
            <p><b>住址</b>: {{ person.residence }}</p>
            <!-- <p><b>职业</b>: {{ person.occupation }}</p> -->
            <!-- <p><b>关注</b>: {{ person.attention }}</p> -->
            <!-- <p><b>倾向</b>: {{ person.tendency }}</p> -->
            <!-- <p><b>影响</b>: {{ person.influence }}</p> -->
            <!-- <p><b>信仰</b>: {{ person.faith }}</p> -->
            <!-- <p><b>教育</b>: {{ person.education }}</p> -->
            <!-- <p><b>评论</b>: {{ person.comment }}</p> -->
          </Card>
        </template>
        <template v-else>
          {{ '无数据' }}
        </template>
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      groupList: [],
      personList: {},
      activeId: null
    }
  },
  props: ['eventId'],
  watch: {
    eventId (id) {
      this.fetchGroupByEventIdFromServer(id)
    }
  },
  methods: {
    fetchGroupByEventIdFromServer (id) {
      this.$axios.get('/events/fetchGroup', {
        params: {
          eventId: id
        }
      }).then((res) => {
        this.groupList = res.data.groupList
      }).catch((err) => {
        console.log(err)
      })
    },
    fetchPersonByGroupIdFromServer (id) {
      this.$axios.get('/group/fetchPerson', {
        params: {
          groupId: id
        }
      }).then((res) => {
        this.personList[res.data.name] = res.data.personList
        this.activeId = id
      })
    },
    handleLoadPerson (id) {
      this.fetchPersonByGroupIdFromServer(id)
    }
  },
  mounted () {
    this.fetchGroupByEventIdFromServer(this.eventId)
  }
}
</script>

<style lang="css">
</style>
