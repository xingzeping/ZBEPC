<template>
  <div class="login-container">
    <div class="login-bg">
    
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form animated fadeInLeft" auto-complete="on" label-position="left">
      <!-- <img src="../../assets/LOGO.png" alt="" class="logo"> -->
      <div class="title">登录</div>
      <el-form-item prop="userName">
        <div class="left">用户名</div>
        <el-input v-model="loginForm.userName" name="userName" type="text" auto-complete="on" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <div class="left">登录密码</div>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
   
      <div class="remember"><div class="ico" :class="{check:ischeck}"v-show="false" @click="check"></div><span></span></div>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data: function() {
    const validateUsername = (rule, value, callback) => {
      // if (!isvalidUsername(value)) {
      //   callback(new Error('请输入正确的用户名'))
      // } else {
      //   callback()
      // }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        // userName: 'admin',
        // password: 'admin'
      },
      ischeck:false,//是否勾选
      loginRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            // this.$router.push({ path: this.redirect || '/' })
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!');
          return false
        }
      })
    },
    //点击勾选
    check () {
      this.ischeck = !this.ischeck;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 70%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #909399;
      height: 47px;
      font-size: 16px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #909399 !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    color: #454545;
    border-bottom: 1px solid #E1E1E1;
    .el-button--primary  {
      margin-top:30px;
      background-color: #11bf92;
      border-color: #11bf92;
    }
    .el-form-item__content {
      display: flex;
      .left {
        display: flex;
        align-items: center;
      }
    }
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.login-bg{
  position: relative;
  background-image: url(../../assets/login-bg.jpg);
  width: 100%;
  background-size: 100% 100%;
  min-width: 1355px;
}
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  display: flex;
  height: 100%;
  .login-form {
    position: absolute;
    right: 15%;
    top: 35%;
    background-color: #fff;
    padding: 30px;
    border-radius: 12px;
    flex:1;
    width: 25%;
    height: 350px;
    box-sizing: border-box;
    text-align: center;
    .title {
      text-align: left;
      color: #11bf92;
      margin-bottom: 30px;
    }
    .remember {
      display: flex;
      .ico {
        width: 16px;
        height: 16px;
        border: 1px solid #11bf92;
        border-radius: 2px;
        margin-right: 10px; 
        &.check {
          background: url('~@/assets/icon-y.png') no-repeat;
        }
      }
      color: #999;
      font-size: 16px;
    }
  }
  .logo{
    margin: 70px 0 70px 0;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

