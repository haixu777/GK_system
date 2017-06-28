<template lang="html">
  <div class="login">
    <Card>
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <Form-item prop="user">
          <Input type="text" v-model="formInline.username" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </Form-item>
        <Form-item prop="password">
          <Input type="password" v-model="formInline.password" placeholder="Password" @keyup.enter.native="handleSubmit('formInline')">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
        </Form-item>
      </Form>
    </Card>
  </div>
</template>

<script>
const $utils = require('utils')
export default {
  data () {
    return {
      formInline: {
        username: '',
        password: ''
      },
      ruleInline: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loginToServer()
        } else {
          this.$Message.error('表单验证失败')
        }
      })
    },
    loginToServer () {
      this.$axios.post('/user/login', {
        username: this.formInline.username,
        password: this.formInline.password
      }).then((res) => {
        if (res.data.success) {
          $utils.Cookie.set('login', true)
          // this.$router.push('home')
          $utils.Cookie.set('isAdmin', Boolean(res.data.user.admin)) // wxb用户
          this.$router.push('calendar') // wxb用户
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  mounted () {
    // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
  }
}
</script>

<style lang="scss">
  .login {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -150px 0 0 -100px;
  }
</style>
