<template>
  <div class="box">
    <div class="container">
      <div class="title">请登录</div>
      <el-form :model="formData" :rules="formRules" ref="form">
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="formData.password" placeholder="请输入密码" ></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="login" class="login-btn" type="primary">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import req from '@/api/user-manage.js'
const qs = require('qs')
export default {
  name: 'login',
  data () {
    return {
      formData: {
        username: '',
        password: ''
      },
      userCode: '',
      formRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('submit!')
          axios({
            method: 'post',
            url: 'http://299213w34l.wicp.vip:14644/uaa/auth/form',
            data: qs.stringify(this.formData),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;'
            }
          }).then(data => {
            console.log(data)
            if (data.data.code === 0) {
              this.$message({
                type: 'success',
                message: data.data.msg
              })
              sessionStorage.setItem('userInfo', JSON.stringify(data.data.data))
              this.topColumnUserData()
              // this.$router.push({path: '/home'})
            } else {
              this.$message({
                type: 'error',
                message: data.data.msg
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 查询详细信息
    topColumnUserData () {
      req('topColumnUserData', {
        // userCode: this.userCode
      }).then(data => {
        console.log(data)
        if (data.code === 0) {
          sessionStorage.setItem('roleInfo', JSON.stringify(data.data))
          if (data.data.role === 1) {
            this.$router.push({path: '/home'})
          } else if (data.data.role === 2) {
            this.$router.push({path: '/client-manage'})
          }
        } else {
          this.$message({
            type: 'erroe',
            message: data.msg
          })
        }
        // this.userCode = data.data.userCode
        // this.userName = data.data.userName
        // this.userPictureUrl = data.data.userPictureUrl
        // this.role = data.data.role
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  background-image: url('../assets/login-bg.png');
  height: 730px;
  background-repeat: no-repeat;
  background-size:100% 100%;
  background-attachment:fixed;
  .container {
    width: 300px;
    height: 250px;
    background: rgba(221, 221, 221, 0.452);
    position: fixed;
    right: 100px;
    top: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    opacity: 1;
    .title {
      text-align: center;
    }

    .el-form {
      display: flex;
      height: 120px;
      flex-direction: column;
      justify-content: space-around;
      .el-form-item {
        width: 100%;
        text-align: center;
        margin-bottom: 0px;

      }
    }
    .login-btn {
      display: block;
      width: 100px;
      height: 30px;
    }
  }
}
</style>
