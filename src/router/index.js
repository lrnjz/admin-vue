import Vue from 'vue'
import Router from 'vue-router'
import {getUserInfo} from '@/assets/js/auth'

import Login from '@/components/login/login'
import Home from '@/components/home/home'
import UserList from '@/components/user-list/user-list'
import RoleList from '@/components/role-list/role-list'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'user-list',
          path: '/users',
          component: UserList
        },
        {
          name: 'role-list',
          path: '/roles',
          component: RoleList
        }
      ]
    }
  ]
})

// 添加路由拦截器（导航钩子、守卫）
// 接下来所有视图导航都必须经过这道关卡
router.beforeEach((to, from, next) => {
  // 拿到当前请求的视图路径标识
  // 登陆组件直接放行，非登陆组件，检查令牌 有令牌过去 无则登陆
  if (to.name === 'login') {
    next()
  } else {
    // 检查登陆状态令牌
    if (!getUserInfo()) {
      next({
        name: 'login'
      })
    } else {
      next()
    }
  }
})
export default router
