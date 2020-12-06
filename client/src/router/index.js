import Vue from 'vue'
import Router from 'vue-router'
// 引入组件
import Home from '../views/Home'
import Login from '../views/Login'
import Welcome from '../components/welcome'
import InfoStd from '../components/infoStd'
import InfoCk from '../components/infoCK'
import FnNightCK from '../components/fnNightCK'
import ReportCK from '../components/reportCK'
import infoRoom from '../components/infoRoom'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: 'Login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/infoStd', component: InfoStd },
        { path: '/infoCk', component: InfoCk },
        { path: '/infoRoom', component: infoRoom },
        { path: '/fnNightCK', component: FnNightCK },
        { path: '/reportCK', component: ReportCK }
      ]
    }
  ]
})

//获取原型对象上的push函数
const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
