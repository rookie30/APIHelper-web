<template>
  <div class="register">
    <el-page-header class="register-header" @back="goBack" />
    <el-form ref="registerForm" v-loading="isLoading" :model="registerForm" class="register-form" label-position="right" label-width="80px" :rules="registerRules">
      <h2 class="title">欢迎注册APIHelper</h2>
      <el-form-item prop="username" label="用户名">
        <el-input v-model="registerForm.username" placeholder="请输入用户名" auto-complete="off" />
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="registerForm.password" show-password placeholder="请输入密码" />
      </el-form-item>
      <el-form-item prop="checkPwd" label="确认密码">
        <el-input v-model="registerForm.checkPwd" show-password placeholder="请确认密码" />
      </el-form-item>
      <!-- <el-form-item prop="username" label="姓名">
                <el-input v-model="registerForm.username" placeholder="请输入姓名" auto-complete="off"></el-input>
            </el-form-item> -->
      <el-form-item prop="nickname" label="昵称">
        <el-input v-model="registerForm.nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item prop="gender" label="性别">
        <template>
          <el-radio v-model="registerForm.gender" label="0">女</el-radio>
          <el-radio v-model="registerForm.gender" label="1">男</el-radio>
        </template>
      </el-form-item>
      <el-form-item prop="phone" label="手机号">
        <el-input v-model="registerForm.phone" placeholder="请输入手机号" auto-complete="off" />
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="registerForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="submitBtn" @click.prevent="submitForm('registerForm')">立即注册</el-button>
        <el-popconfirm title="确定重置表单吗?" @onConfirm="resetForm('registerForm')">
          <el-button slot="reference" class="resetBtn">重置</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { add } from '@/api/system/user'
export default {
  name: 'Register',
  data() {
    var checkAccount = (rule, value, callback) => {
      if (!(/^[0-9a-zA-Z@.]{5,20}$/).test(value)) {
        return callback(new Error('账号应由数字、字母或@与.构成'))
      } else {
        callback()
      }
    }
    var checkPassword = (rule, password, callback) => {
      if (!(/^[0-9a-zA-Z.@]{5,15}$/).test(password)) {
        return callback(new Error('密码应由字母或数字组成'))
      } else {
        callback()
      }
    }
    var checkConfirmPwd = (rule, pwd, callback) => {
      if (pwd != this.registerForm.password) {
        return callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    // var checkName = (rule, name, callback) => {
    //   if (!(/^[\u4e00-\u9fa5a-zA-Z]{2,10}$/).test(name)) {
    //     return callback(new Error('含有非法字符!'))
    //   } else {
    //     callback()
    //   }
    // }
    var checknickname = (rule, name, callback) => {
      if (!(/^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/).test(name)) {
        return callback(new Error('含有非法字符!'))
      } else {
        callback()
      }
    }
    var checkPhone = (rule, phone, callback) => {
      var reg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/
      if (!reg.test(phone) && phone.length != 0) {
        return callback(new Error('电话格式非法'))
      } else {
        callback()
      }
    }
    var checkEmail = (rule, email, callback) => {
      var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
      if (!reg.test(email)) {
        return callback(new Error('邮箱格式非法!'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        checkPwd: '',
        nickname: '',
        gender: '0',
        phone: '',
        email: ''
      },
      isLoading: false,
      registerRules: {
        username: [
          { required: true, trigger: 'blur', message: '账号不能为空' },
          { min: 5, max: 20, trigger: 'blur', message: '账号长度应在 5 到 20 个字符内' },
          { validator: checkAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          { min: 5, max: 15, message: '密码长度应在 5 到 15 个字符内', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ],
        checkPwd: [
          { required: true, trigger: 'blur', message: '请确认密码' },
          { validator: checkConfirmPwd, trigger: 'blur' }
        ],
        nickname: [
          { required: true, trigger: 'blur', message: '昵称不能为空' },
          { min: 1, max: 10, trigger: 'blur', message: '昵称应为 1 到 10 个字符内' },
          { validator: checknickname, trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' },
          { required: true, trigger: 'blur', message: '请输入手机号' }
        ],
        email: [
          { required: true, trigger: 'blur', message: '邮箱不能为空' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(registerForm) {
      this.$refs.registerForm.validate(valid => {
        const user = this.registerForm;
        if (valid) {
          this.isLoading = true;
          // console.log(user);
          add(user).then(res => {
            if (res.code == '201') {
              this.$message.success('注册成功');
              setTimeout(() => {
                this.$router.push('/login');
              }, 2000)
            }
            this.isLoading = false;
          }).catch(err => {
            this.isLoading = false;
          })
        }
      })
    },
    resetForm(registerForm) {
      this.$refs[registerForm].resetFields();
    },
    goBack() {
      this.$router.push('/login');
    }

  }
}
</script>

<style scoped>
    .register {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .register .register-header {
        width: 100%;
        padding: 10px 10px;
    }
    .register .register-form {
        width: 40%;
    }
    .register .title {
        text-align: center;
    }
    .register .register-form .el-form-item {
        margin: 35px 0;
    }
    .register .resetBtn {
        margin-left: 10px;
    }
</style>
