<template lang="html">
  <div class="myTag_container">
    <div class="condition_row">
      <label class="condition_label">范围</label>
      <Select v-model="condition.domain" clearable style="width:100px" @on-change="fetchTableData">
        <Option :value="'个人'">{{ '个人' }}</Option>
        <Option :value="'组内'">{{ '组内' }}</Option>
        <Option :value="'全局'">{{ '全局' }}</Option>
      </Select>
    </div>
    <Table
      :data="tagTableData"
      :columns="columns"
      border
      stripe
      size="small">
    </Table>
    <Button size="small" type="primary" icon="ios-plus" style="float:left;" @click="modal = true">新增</Button>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
          show-total
          :total="totalItem"
          :current="currentPage"
          :page-size-opts="[10, 20, 30, 40]"
          show-sizer
          @on-page-size-change="onSizeChange"
          @on-change="handleChangePage"></Page>
      </div>
    </div>

    <Modal
      v-model="modal"
      @on-cancel="$refs['tagAddObj'].resetFields()"
      :width="300">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>标签添加</span>
      </p>
      <div style="">
        <Form ref="tagAddObj" :model="tagAddObj" :rules="ruleValidate" :label-width="50">
          <FormItem label="名称" prop="name">
            <Input v-model="tagAddObj.name" placeholder="请输入标签名称"></Input>
          </FormItem>
          <FormItem label="范围" prop="domain">
            <RadioGroup v-model="tagAddObj.domain">
              <Radio label="个人">
                <span>个人</span>
              </Radio>
              <Radio label="组内" :disabled="auth.indexOf('普通') !== -1">
                <span>组内</span>
              </Radio>
              <Radio label="全局" :disabled="(auth.indexOf('高级') !== -1) || (auth.indexOf('普通') !== -1)">
                <span>全局</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <div slot="footer">
            <Button>btn</Button>
          </div>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" long @click="tagAdd('tagAddObj')">添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
const $utils = require('utils')
export default {
  data () {
    return {
      columns: [
        {
          type: 'index',
          width: 60
        },
        {
          title: '范围',
          key: 'domain'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: this.handleEditBtn(params.row.domain)
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.tagEdit(params.row.id, params.row.name)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: this.handleEditBtn(params.row.domain)
                },
                on: {
                  click: () => {
                    this.tagDel(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      condition: {
        domain: '',
        name: null
      },
      tagAddObj: {
        domain: null,
        name: null
      },
      perItem: 10,
      currentPage: 1,
      totalItem: 100,
      ruleValidate: {
        name: [
          { required: true, message: '请输入标签名', trigger: 'blur' }
        ],
        domain: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      },
      modal: false,
      auth: unescape($utils.Cookie.get('userAuth')),
      tagTableData: [],
      renameValue: ''
    }
  },
  methods: {
    fetchTableData () {
      this.$axios.get('/tag/list', {
        params: {
          userId: unescape($utils.Cookie.get('userId')),
          dept_name: unescape($utils.Cookie.get('deptName')),
          domain: this.condition.domain,
          currentPage: this.currentPage,
          perItem: this.perItem
        }
      }).then((res) => {
        this.tagTableData = res.data.tagList.itemList
        this.totalItem = res.data.tagList.totalItem
      }).catch((err) => {
        console.log(err)
      })
    },
    tagAddToServer () {
      this.$axios.post('/tag/add', {
        userId: unescape($utils.Cookie.get('userId')),
        dept_name: unescape($utils.Cookie.get('deptName')),
        domain: this.tagAddObj.domain,
        name: this.tagAddObj.name
      }).then((res) => {
        if (res.data.success) {
          this.$Message.success(res.data.msg)
          this.fetchTableData()
          this.modal = false
          this.$refs['tagAddObj'].resetFields()
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    renameTagToServer (id, name) {
      this.$axios.post('/tag/rename', {
        id: id,
        name: this.renameValue
      }).then((res) => {
        if (res.data.success) {
          this.fetchTableData()
          this.$Message.success(res.data.msg)
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    delTagFromServer (id) {
      this.$axios.post('/tag/del', {
        id: id
      }).then((res) => {
        if (res.data.success) {
          this.fetchTableData()
          this.$Message.success(res.data.msg)
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    tagAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.tagAddToServer()
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    handleChangePage (activePage) {
      this.currentPage = activePage
      this.fetchTableData()
    },
    onSizeChange (perItem) {
      this.perItem = perItem
      this.fetchTableData()
    },
    handleEditBtn (itemAuth) {
      if (this.auth.indexOf('普通用户') !== -1) {
        if (itemAuth === '个人') {
          return false
        } else {
          return true
        }
      } else if (this.auth.indexOf('高级用户') !== -1) {
        if (itemAuth === '个人' || itemAuth === '组内') {
          return false
        } else {
          return true
        }
      } else if (this.auth.indexOf('管理员') !== -1) {
        return false
      }
    },
    tagEdit (id, name) {
      this.$Modal.confirm({
        width: 200,
        render: (h) => {
          return h('Input', {
            props: {
              value: name,
              autofocus: true,
              placeholder: 'Please enter your name...'
            },
            on: {
              input: (val) => {
                this.renameValue = val
              }
            }
          })
        },
        onOk: () => {
          this.renameTagToServer(id)
        }
      })
    },
    tagDel (id) {
      this.delTagFromServer(id)
    }
  },
  mounted () {
    this.fetchTableData()
  }
}
</script>

<style lang="scss">
.myTag_container {
  // background: #f2f2f2;
  .condition_row {
    text-align: left;
    padding: 8px 0;
    .condition_label {
      text-align: right;
      vertical-align: middle;
      font-size: 16px;
      color: #48576a;
      line-height: 1;
      padding: 11px 12px 11px 0;
      box-sizing: border-box;
    }
  }
}
</style>
