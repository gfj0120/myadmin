<template>
  <div class="login">
      <el-form status-icon :model="form" :rules="rules" ref="form" label-width="80px">
        <img src="../assets/f8.jpg" alt="">
         <el-form-item label="用户名" prop="username">
           <el-input @keyup.enter.native="login" v-model="form.username" placeholder="请输入用户名"></el-input>
         </el-form-item>
         <el-form-item label="密码" prop="password">
           <el-input @keyup.enter.native="login" type="password" v-model="form.password" placeholder="请输入密码"></el-input>
         </el-form-item>
          <el-form-item>
           <el-button type="primary" class="loginBtn" @click="login">登录</el-button>
           <el-button @click="reset">重置</el-button>
         </el-form-item>

      </el-form>
  </div>
</template>

<script>

//  ref 和 $refs
//  作用: 用于结合在一起, 获取dom元素或者获取vue组件实例
//  1. 可以获取dom元素
//  2. 可以获取vue组件实例

//  步骤:
//  1. 给需要获取的元素添加上 ref 属性
//  2. 只要配置好了 ref 属性, 就可以通过 this.$refs 获取到该元素的引用
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在3到12个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在3到12个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      // console.log(this.$refs) 能够拿到form
      this.$refs.form.resetFields()
    },
    async login () {
      try {
        await this.$refs.form.validate()
        console.log('成功了')
        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$message({
            message: meta.msg,
            type: 'success'
          })
          this.$router.push({ name: 'index' })
        } else {
          // 3. 可以在调用方法的同时, 指定提示的类型
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
      // this.$refs.form.validate(isValid => {
      //   if (!isValid) return
      //
      // axios({
      //   method: 'post',
      //   url: 'http://localhost:8888/api/private/v1/login',
      //   data: this.form
      // }).then(res => {
      //   const { meta } = res.data
      //   if (meta.status === 200) {
      //     this.$router.push('./index')
      //   } else {
      //     console.log(meta.msg)
      //   }
      // })
      // axios.post(url, data).then(..).catch(..)

      // 改写
      // this.$axios.post('login', this.form).then(res => {
      //   // console.log(res.data)
      //   const { meta, data } = res
      //   if (meta.status === 200) {
      //     localStorage.setItem('token', data.token)
      //     this.$message({
      //       message: meta.msg,
      //       type: 'success'
      //     })
      //     this.$router.push({ name: 'index' })
      //   } else {
      //     // 3. 可以在调用方法的同时, 指定提示的类型
      //     this.$message.error(meta.msg)
      //   }
      // })
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
    .el-form {
      width: 400px;
      padding: 20px;
      padding-top: 70px;
      border-radius: 20px;
      background: #fff;
      margin: 0 auto;
      margin-top: 100px;
      .loginBtn {
        margin-right: 70px;
      }
      img {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 40px;
        width: 120px;
        height: 120px;
        border: 5px solid #fff;
        border-radius: 50%;
      }
  }
}
</style>
