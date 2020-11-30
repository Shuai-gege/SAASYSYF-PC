<template>
  <div class="login-container" :style="bgImg">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">物业管控平台</h3>
      </div>
      <!-- 账号 -->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <!-- <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />-->
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <!-- 验证码 -->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class />
        </span>
        <el-input
          ref="authCode"
          v-model="loginForm.code"
          placeholder="验证码"
          name="authCode"
          type="text"
          tabindex="1"
          autocomplete="on"
        />

        <img :src="url" class="imgCode" @click.stop="smsCode" />
      </el-form-item>

      <!-- <el-button
        :loading="loading"
        type="success"
        style="width:48%;margin-bottom:30px;"
        @click.native.prevent
      >注册</el-button>-->
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
      <!-- 忘记密码 -->
      <a class="noPassword" @click="dialogVisible = true">忘记密码?</a>
      <!-- 注册登录 -->
      <div class="reg">
        <div class="title">扫码免费注册</div>
        <img src="./loginImg/reg.jpg" alt />
      </div>
      <!--  -->
      <div style="position:relative">
        <div class="tips">
          <!-- <span>推荐使用谷歌浏览器</span>-->
        </div>

        <!-- <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          Or connect with
        </el-button>-->
      </div>
    </el-form>
    <!-- 找回密码弹窗 -->
    <div class="content">
      <el-dialog title="提示" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
        <el-form
          label-position="right"
          :rules="rules"
          label-width="80px"
          :model="forget"
          ref="ruleForm"
        >
          <el-form-item label="账号">
            <el-input v-model="forget.tel"></el-input>
          </el-form-item>
          <el-form-item label="短信验证">
            <el-input v-model="forget.sms"></el-input>
            <el-button
              type="primary"
              size="mini"
              style="position:absolute;top:10px;right:20px"
              @click="smCode"
              v-if="flag"
            >发送验证码</el-button>
            <el-button
              type="primary"
              size="mini"
              style="position:absolute;top:10px;right:20px;width:92px"
              disabled
              v-else
            >{{time}}</el-button>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="forget.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="endPassword">
            <el-input v-model="forget.endPassword"></el-input>
          </el-form-item>
          <el-form-item style="background:#fff;padding-left:250px;">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="pwd">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- ---------- -->
    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br />
      <br />
      <br />
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'
import { modifyPwd, getSMCode } from '@/api/permission/user'
import { getList } from '../../api/iguard/saas'
export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validateAuthCode = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.forget.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
        code: ''
      },
      flag: true,
      time: '180',
      forget: {
        tel: '',
        sms: '',
        newPassword: '',
        endPassword: ''
      },
      dialogVisible: false,
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        authCode: [
          { required: true, trigger: 'blur', validator: validateAuthCode }
        ]
      },
      // 忘记密码
      rules: {
        newPassword: [{ validator: validatePass, trigger: 'blur' }],
        endPassword: [{ validator: validatePass2, trigger: 'blur' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      bgImg: {
        backgroundImage: 'url(' + require('../../assets/bk.jpg') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      },
      url:
        process.env.VUE_APP_BASE_API_URL2 + '/rest/user/captchaImage?type=char'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    console.log(this.url)
    console.log('asdasdasdasd')
    this.getCheckList()
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    } else if (this.loginForm.code === '') {
      this.$refs.authCode.focus()
    }
  },

  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    async getCheckList() {
      try {
        const res = await getList()
        console.log(res)
        if (res.code == 20000) {
          localStorage.setItem('vip', JSON.stringify(res.result))
        }
      } catch (err) {
        console.log(err)
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.forget.tel = ''
          this.forget.sms = ''
          this.forget.newPassword = ''
          this.forget.endPassword = ''
          done()
        })
        .catch(_ => {})
    },
    smsCode() {
      console.log('aa')
      let src = this.url
      this.url = ''
      this.$nextTick(() => {
        this.url = src
      })
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= 'a' && key <= 'z') ||
          (!shiftKey && key >= 'A' && key <= 'Z')
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          console.log(this.loginForm)
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              })
              this.loading = false
            })
            .catch(() => {
              console.log('我点击登陆但是失败')
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    // 找回密码验证码
    async smCode() {
      if (this.forget.tel != '') {
        try {
          const res = await getSMCode(this.forget.tel)
          console.log(res)
          if (res.code == 20000) {
            this.flag = false
            let smCode = setInterval(() => {
              this.time--
              if (this.time == '0') {
                this.time = '180'
                this.flag = true
                window.clearInterval(smCode)
                console.log('还走吗')
              }
              console.log('还走吗11111')
            }, 1000)
            this.message({
              message: '验证码发送成功',
              type: 'success'
            })
          }
        } catch (err) {
          console.log(err)
        }
      } else {
        this.$message('请输入手机号')
      }
    },
    async pwd() {
      let obj = {}
      obj.phone = this.forget.tel
      obj.validCode = this.forget.sms
      obj.newPassword = this.forget.newPassword
      if (obj.phone == '') {
        this.$message({
          message: '请填写手机号',
          type: 'warning'
        })
      } else if (obj.validCode == '') {
        this.$message({
          message: '请填写验证码',
          type: 'warning'
        })
      } else if (obj.newPassword == '') {
        this.$message({
          message: '请填写新密码',
          type: 'warning'
        })
      } else if (this.forget.endPassword == '') {
        this.$message({
          message: '请确认新密码',
          type: 'warning'
        })
      } else {
        try {
          const res = await modifyPwd(obj)
          console.log(res)
          if (res.code == 20000) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.forget.tel = ''
            this.forget.sms = ''
            this.forget.newPassword = ''
            this.forget.endPassword = ''
          } else {
            this.$message.error(res.msg)
          }
        } catch (err) {
          console.log(err)
        }
      }
    }

    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .noPassword {
    font-size: 12px;
    color: blue;
    text-decoration: underline;
  }
  .imgCode {
    width: 150px;
    height: 42px;
    position: absolute;
    top: 5px;
    left: 285px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .content {
    input {
      color: #000;
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: visible;
  }
  .reg {
    width: 200px;
    height: 200px;
    position: absolute;
    left: 520px;
    top: 200px;
    .title {
      text-align: center;
      padding-bottom: 20px;
      color: #fff;
      font-weight: 700;
      font-size: 20px;
    }
    img {
      width: 200px;
      height: 200px;
    }
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

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
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

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
