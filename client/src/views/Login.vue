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
          <el-form-item prop="uid">
            <el-input size="medium" v-model="loginUser.uid" placeholder="请输入账号">
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input size="medium" v-model="loginUser.pwd" placeholder="请输入密码" show-password>
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
  name: 'Login',
  data() {
    let vaildataUid = (reul) => {
    }
    return {
      loginUser: {
        uid: '',
        pwd: ''
      },
      rules: {
        uid: [
          { required: true, message: '用户名不能空', tigger: 'blur' },
          { min: 3, message: '用户名不能少于 4 字符', tigger: 'change' }
        ],
        pwd: [
          { required: true, message: '用户名不能空', tigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 提交表单
    submitForm(form) {
      this.$refs[form].validate(async valid => {
        // 表单校验
        if (!valid) return
        // 用户查询
        const { data: res } = await this.$axios.post('/api/vaild_user', {
          uid: this.loginUser.uid,
          pwd: this.loginUser.pwd
        })
        // 状态码判断
        if (res.status != 200) {
          alert('用户名或密码错误！')
          return
        }
        // 保存token
        window.sessionStorage.setItem('token', res.token)
        // 路由跳转
        this.$router.push('/home')
      })
    },
    // 重置表单
    resetForm(form) {
      this.$refs[form].resetFields()
    }
    
  },
  created() {
  }
}
</script>

<style lang="less" type="text/less" scoped>
@import url(../assets/css/index.less);
  .login {
    min-height: 100vh;
    padding-top: 30px;
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
  @media screen and (min-width: 769px) {
    .box-card {
      width: 48%;
      max-width: 350px;
    }
  }
</style>
