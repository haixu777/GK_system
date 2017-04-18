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
          <Input type="password" v-model="formInline.password" placeholder="Password">
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
      this.$axios.post('user/login', {
        username: this.formInline.username,
        password: this.formInline.password
      }).then((res) => {
        this.$Message.success(res.data.msg)
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
