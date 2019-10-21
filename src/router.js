import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login.vue'
import Index from './components/index.vue'
import Users from './components/users/users.vue'
import Roles from './components/rights/roles.vue'
import Rights from './components/rights/rights.vue'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/login',
      name: 'login',
      component: Login

    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        { path: '/users', name: 'users', component: Users },
        { path: '/roles', name: 'roles', component: Roles },
        { path: '/rights', name: 'rights', component: Rights }
      ]

    }
  ]
})

router.beforeEach((to, from, next) => {
  // 不管去哪里都要先经过这个全句前置路由守卫
  // console.log(to)
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
