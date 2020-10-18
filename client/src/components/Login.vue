<template>
  <!-- 登录页 -->
  <div class="login">
    <!-- 提示语 -->
    <header class="text_center pd_20">
      <span class="fontS_1">欢迎使用 K5 学生宿舍管理系统</span>
    </header>
    <!-- 登录面板 -->
    <main class="pd_10">
      <el-card class="box-card">
        <!-- 标题 -->
        <header class="text_center mg_b10">
          <span class="fontS_2">登陆</span>
        </header>
        <!-- 登录表单 -->
        <el-form ref="loginForm" :rules="rules" :model="loginUser">
          <el-form-item prop="name">
            <el-input size="medium" v-model="loginUser.name" placeholder="请输入账号">
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input size="medium" v-model="loginUser.pwd" placeholder="请输入密码">
              <i slot="prefix" class="el-input__icon el-icon-key"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="submitForm('loginForm')">登录</el-button>
            <el-button size="small" @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginUser: {
        name: '',
        pwd: ''
      },
      rules: {
        name: [
          { required: true, message: '用户名不能空', tigger: 'change' },
          { min: 3, message: '用户名不能少于 3 字符', tigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '用户名不能空', tigger: 'change' },
          { min: 3, message: '用户名不能少于 3 字符', tigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('登录成功！', this.$refs.loginForm)
        } else {
          console.log('登录失败！')
        }
      })
    }
  },
  created() {
    // console.log(this.$refs, this.$refs.warning)
  }
}
</script>

<style lang="less" type="text/less" scoped>
@import url(../assets/css/index.less);
  .login {
    min-height: 100vh;
    overflow: hidden;
    background-color: #409EFF;
  }
  .box-card{
    margin: auto;
  }
  @media screen and (max-width: 768px) {
    .box-card {
      width: 78%;
    }
  }
</style>
