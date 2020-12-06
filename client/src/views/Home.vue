<template>
  <div class="home">
    <!-- 左列头部 -->
    <header>
      <nav>
        <el-button type="info" @click="logout">退出帐户</el-button>
        <!-- <el-button type="info" @click="sayhey">test</el-button> -->
        <el-menu
          class="el-menu-vertical-demo no-border"
          background-color="#545c64"
          text-color="#fff">
          <el-menu-item @click="changePage('home')">
            <template slot="title">主页</template>
          </el-menu-item>
        </el-menu>
        <el-menu
          class="el-menu-vertical-demo no-border"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="false"
          :router="true"
          :default-active="activePath">
          <el-submenu 
            :index="item.id + ''"
            v-for="item in navList"
            :key="item.id">
            <template slot="title">
              <span>{{ item.name }}</span>
            </template>
              <el-menu-item
                :index="'/'+ subitem.router"
                v-for="subitem in item.children"
                :key="subitem.id"
                @click="saveNavState( subitem.router)">
                <template slot="title">{{ subitem.name }}</template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </nav>
    </header>
    <!-- 右列内容 -->
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        {
          id: 1,
          name: '基本信息',
          children: [
            {
              id: 1.1,
              name: '学生信息',
              router: 'infoStd'
            },{
              id: 1.2,
              name: '宿舍信息',
              router: 'infoRoom'
            }, {
              id: 1.3,
              name: '考勤记录',
              router: 'infoCK'
            }
          ]
        }, {
          id: 2,
          name: '功能模块',
          children: [
            {
              id: 2.1,
              name: '夜间考勤',
              router: 'fnNightCk'
            }
          ]
        }, {
          id: 3,
          name: '数据统计',
          children: [
            {
              id: 3.1,
              name: '考勤统计',
              router: 'reportCK'
            }
          ]
        }
      ]

    }
  },
  created(){
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 注销用户
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    changePage(router) {
      this.$router.push('/' + router)
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.$router.push('/' + activePath)
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
}
.home > header {
  min-width: 200px;
  height: 100vh;
  background-color: #545c64
}
.home > main {
  width: 100%;
  min-width: 1000px;
  height: 100vh;
  padding: 20px;
}
.no-border {
  border: none;
}
</style>