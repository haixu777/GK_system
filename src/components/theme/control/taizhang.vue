<template lang="html">
  <div class="control_manual_review">
    <div class="condition_container">
      <div class="">
        <span class="title">事件筛选</span>
        <Select v-model="event_id"
          filterable
          placeholder="事件筛选"
          clearable
          style="width:200px;"
          class=""
          @on-change="fetchTaizhangList">
          <Option v-for="item in eventList" :value="item.value" :key="item.value">
            {{ item.text }}
          </Option>
        </Select>
      </div>
      <div class="" style="float:right;">
        <Button type="success" icon="ios-plus" @click="handleAdd">添加</Button>
      </div>
    </div>
    <!-- <Table stripe border :columns="columns" :data="taizhangList"></Table> -->
    <el-table
      :data="taizhangList"
      border
      style="width: 100%;text-align:left;">
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline class="my-table-expand">
            <el-form-item :label="'第'+(++index)+'阶段'" v-for="content, index in taizhangProcess(props.row.content)" :key="index">
              <span>{{ content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="70"></el-table-column>
      <!-- <el-table-column
        width="70"
        type="index">
      </el-table-column> -->
      <el-table-column
        label="时间"
        width="120"
        prop="time">
      </el-table-column>
      <el-table-column
        label="所属事件"
        width="200"
        prop="event">
      </el-table-column>
      <el-table-column
        label="摘要">
        <template scope="scope">
          <span style="margin-left: 10px">{{ taizhangProcess(scope.row.content, true) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="目标"
        width="100"
        prop="target">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="delFromServer(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Page
      style="float: right;"
      :total="totalItem"
      :current="currentPage"
      :page-size="perItem"
      :page-size-opts="[10, 20, 30, 50, 100]"
      @on-change="handlePageChange"
      @on-page-size-change="handlePagesizeChange"
      show-total
      size="small"
      show-sizer>
    </Page>

    <Modal v-model="modal" width="800" @on-cancel="$refs['formValidate'].resetFields()">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ isAdd ? '台账添加' : '台账编辑' }}</span>
      </p>
      <div style="text-align:center">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
          <FormItem label="时间" prop="time">
            <Date-picker type="date" placeholder="选择日期" v-model="formValidate.time"></Date-picker>
          </FormItem>
          <Form-item label="所属事件">
            <Select v-model="formValidate.event_id" style="" filterable>
              <Option v-for="item in eventList" :value="item.value" :key="item">{{ item.text }}</Option>
            </Select>
          </Form-item>
          <FormItem label="内容" prop="content">
            <Input v-model="formValidate.content" :rows="6" placeholder="请输入内容" type="textarea"></Input>
          </FormItem>
          <FormItem label="管控目标" prop="target">
            <Input v-model="formValidate.target" placeholder="请输入管控目标"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button v-if="!isAdd" type="success" size="large" long @click="updateToServer">确认</Button>
        <Button v-else type="success" size="large" long @click="addToServer('formValidate')">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      taizhangList: [
        {
          time: '加载中...',
          event: '加载中...',
          target: '加载中...',
          content: '加载中...'
        }
      ],
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 70
        },
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '所属事件',
          key: 'event'
        },
        {
          title: '管控对象',
          key: 'target'
        },
        {
          title: '内容',
          key: 'content'
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.modal = true
                    this.isAdd = false
                    this.taizhangId = params.row.id
                    this.formValidate = {
                      time: params.row.time,
                      event_id: params.row.event_id,
                      target: params.row.target,
                      content: params.row.content
                    }
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.delFromServer(params.row.id)
                    // this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      formValidate: {
        time: new Date(),
        content: '',
        target: '',
        event_id: ''
      },
      ruleValidate: {
        time: [
          // { required: true, message: '时间不能为空', trigger: 'change' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        target: [
          { required: true, message: '管控对象不能为空', trigger: 'blur' }
        ]
      },
      // platformList: [],
      // platform: null,
      // name: '',
      event_id: null,
      eventList: [],
      action: null,
      actionList: [],
      perItem: 10,
      currentPage: 1,
      totalItem: null,
      taizhangId: null,
      timer: null,
      modal: false,
      isAdd: false
    }
  },
  watch: {
    name (val) {
      let _this = this
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        _this.fetchAccountList()
      }, 300)
    }
  },
  methods: {
    fetchTaizhangList () {
      this.$axios.get('/taizhang/list', {
        params: {
          perItem: Number(this.perItem),
          currentPage: this.currentPage,
          event_id: this.event_id
          // operation: this.action,
          // name: this.name
        }
      }).then((res) => {
        // this.accountList = res.data.data.accountList
        this.totalItem = res.data.data.totalItem
        this.taizhangList = res.data.data.taizhangList
        // this.taizhangList.forEach((item) => {// ?这是干嘛的？？date 2018-06-09
        //   // console.log(item.content.split(/\n/))
        // })
        // this.fetchPlatformList()
        // this.fetchActionList()
      }).catch((err) => {
        console.log(err)
      })
    },
    handleAdd () {
      this.$refs['formValidate'].resetFields()
      this.formValidate.event_id = ''
      this.isAdd = true
      this.modal = true
    },
    addToServer (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (!this.formValidate.event_id || !this.formValidate.time) {
            this.$Message.error('输入完整信息')
          } else {
            this.$axios.post('/taizhang/add', {
              time: this.formValidate.time,
              content: this.formValidate.content,
              target: this.formValidate.target,
              event_id: this.formValidate.event_id
            }).then((res) => {
              if (res.data.success) {
                this.modal = false
                this.$Message.success(res.data.msg)
                this.fetchTaizhangList()
              } else {
                this.$Message.error('新增台账失败')
              }
            }).catch((err) => {
              console.log(err)
            })
          }
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    delFromServer (id) {
      this.$axios.post('/taizhang/del', {
        id: id
      }).then((res) => {
        if (res.data.success) {
          this.$Message.success(res.data.msg)
          this.fetchTaizhangList()
        } else {
          this.$Message.error('台账删除失败')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    updateToServer () {
      this.$axios.post('/taizhang/update', {
        id: this.taizhangId,
        time: this.formValidate.time,
        target: this.formValidate.target,
        content: this.formValidate.content,
        event_id: this.formValidate.event_id
      }).then((res) => {
        if (res.data.success) {
          this.modal = false
          this.$Message.success(res.data.msg)
          this.fetchTaizhangList()
        } else {
          this.$Message.error('更新台账失败')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    fetchEventList () {
      this.$axios.get('/control/fetchEventListForControl')
        .then((res) => {
          this.eventList = res.data.eventsList
          console.log(res)
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
    taizhangProcess (content, isMajor) {
      let res = null
      if (isMajor) {
        res = content.split(/\n/)[0]
      } else {
        res = content.split(/\n/)
      }
      return res
    },
    handleEdit (row) {
      this.modal = true
      this.isAdd = false
      this.taizhangId = row.id
      this.formValidate = {
        time: row.time,
        event_id: row.event_id,
        target: row.target,
        content: row.content
      }
    }
    /*
    fetchPlatformList () {
      this.$axios.get('/handleAccount/platform')
        .then((res) => {
          this.platformList = this.filter(res.data.platformList, 'platform')
        }).catch((err) => {
          console.log(err)
        })
    },
    fetchActionList () {
      this.$axios.get('/handleAccount/actionList')
        .then((res) => {
          this.actionList = this.filter(res.data.actionList, 'action')
        }).catch((err) => {
          console.log(err)
        })
    },
    filter (data, type) {
      let res = []
      for (var i = 0; i < data.length; i++) {
        if (type === 'platform') {
          res.push(data[i])
        } else if (type === 'action') {
          res.push(data[i])
        }
      }
      return res
    }
    */
  },
  mounted () {
    this.fetchTaizhangList()
    this.fetchEventList()
  }
}
</script>

<style lang="scss">
.handleAccount {
  .ivu-select-selected-value {
  }
}
.condition_container {
  > div {
    display: inline-block;
  }
  .title {
    padding-left: 30px;
  }
}
.my-table-expand {
  font-size: 0;
  text-align: left;
}
.my-table-expand label {
  width: 75px;
  color: #f40;
}
.my-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
