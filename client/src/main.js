import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/element'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$axios = axios

// axios拦截器
axios.interceptors.request.use(config => {
  // 颁发token令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// Vue.prototype.$qs = qs

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to：将要访问的路径
  // from：代表从哪个路径而来
  // next： 是一个函数，表示放行
  // next()：放行， next('/xx.vue') 强制跳转
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('login')
  next()
})
