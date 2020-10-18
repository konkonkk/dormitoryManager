import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Students from '@/components/baseInfo/Students'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/',
          name: 'Students',
          component: Students
        }
      ]
    }
  ]
})
