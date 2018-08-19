<template lang="html">
  <div class="control_manual_review">
    <div class="condition_container">
      <div class="">
        <span class="title">平台筛选</span>
        <Select v-model="platform"
          filterable
          placeholder="平台筛选"
          clearable
          style="width:120px;"
          class="handleAccount"
          @on-change="fetchAccountList">
          <Option v-for="item in platformList" :value="item.platform" :key="item.platform">
            {{ item.platform }}
          </Option>
        </Select>
      </div>
      <div class="">
        <span class="title">操作筛选</span>
        <Select v-model="action"
          filterable
          placeholder="操作筛选"
          clearable
          style="width:120px;"
          class="handleAccount"
          @on-change="fetchAccountList">
          <Option v-for="item in actionList" :value="item.operation" :key="item.operation">
            {{ item.operation }}
          </Option>
        </Select>
      </div>
      <div class="" style="position:absolute;padding-left:30px;">
        <Input v-model="name">
          <span slot="prepend">名称搜索</span>
          <Button slot="append" icon="ios-search" @click="fetchAccountList"></Button>
        </Input>
      </div>
      <div class="" style="float:right;">
        <Button type="success" icon="ios-plus" @click="handleAdd">添加</Button>
      </div>
    </div>
    <Table stripe border :columns="columns" :data="accountList"></Table>
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

    <Modal v-model="modal" width="300" @on-cancel="$refs['formValidate'].resetFields()">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{ isAdd ? '账号添加' : '账号编辑' }}</span>
      </p>
      <div style="text-align:center">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
          <FormItem label="账号名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入账号名称"></Input>
          </FormItem>
          <FormItem label="平台" prop="platform">
            <Input v-model="formValidate.platform" placeholder="请输入平台"></Input>
          </FormItem>
          <FormItem label="动作" prop="operation">
            <Input v-model="formValidate.operation" placeholder="请输入操作"></Input>
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
      accountList: [
        {
          name: '加载中...',
          platform: '加载中...',
          operation: '加载中...'
        }
      ],
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 70
        },
        {
          title: '账号名称',
          key: 'name'
        },
        {
          title: '平台',
          key: 'platform'
        },
        {
          title: '动作',
          key: 'operation'
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
                    this.accountId = params.row.id
                    this.formValidate = {
                      name: params.row.name,
                      platform: params.row.platform,
                      operation: params.row.operation
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
        name: '',
        platform: '',
        operation: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        platform: [
          { required: true, message: '平台不能为空', trigger: 'blur' }
        ],
        operation: [
          { required: true, message: '操作不能为空', trigger: 'blur' }
        ]
      },
      platformList: [],
      platform: null,
      name: '',
      action: null,
      actionList: [],
      perItem: 10,
      currentPage: 1,
      totalItem: null,
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
    fetchAccountList () {
      this.$axios.get('/handleAccount/list', {
        params: {
          perItem: Number(this.perItem),
          currentPage: this.currentPage,
          platform: this.platform,
          operation: this.action,
          name: this.name
        }
      }).then((res) => {
        this.accountList = res.data.data.accountList
        this.totalItem = res.data.data.totalItem
        this.fetchPlatformList()
        this.fetchActionList()
      }).catch((err) => {
        console.log(err)
      })
    },
    handleAdd () {
      this.$refs['formValidate'].resetFields()
      this.isAdd = true
      this.modal = true
    },
    addToServer (formValidate) {
      this.$refs[formValidate].validate((valid) => {
        if (valid) {
          this.$axios.post('/handleAccount/add', {
            name: this.formValidate.name,
            platform: this.formValidate.platform,
            operation: this.formValidate.operation
          }).then((res) => {
            if (res.data.success) {
              this.modal = false
              this.$Message.success(res.data.msg)
              this.fetchAccountList()
            } else {
              this.$Message.error('新增账号失败')
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.$Message.error('请输入完整信息')
        }
      })
    },
    delFromServer (id) {
      this.$axios.post('/handleAccount/del', {
        id: id
      }).then((res) => {
        if (res.data.success) {
          this.$Message.success(res.data.msg)
          this.fetchAccountList()
        } else {
          this.$Message.error('标签删除失败')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    updateToServer () {
      this.$axios.post('/handleAccount/update', {
        id: this.accountId,
        name: this.formValidate.name,
        platform: this.formValidate.platform,
        operation: this.formValidate.operation
      }).then((res) => {
        if (res.data.success) {
          this.modal = false
          this.$Message.success(res.data.msg)
          this.fetchAccountList()
        } else {
          this.$Message.error('编辑账号失败')
        }
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
  },
  mounted () {
    this.fetchAccountList()
  }
}
</script>

<style lang="scss" scoped>
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
</style>
