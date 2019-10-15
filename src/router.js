import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login.vue'
import Index from './components/index.vue'

Vue.use(Router)

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
      component: Index

    }
  ]
})

router.beforeEach((to, from, next) => {
  // 不管去哪里都要先经过这个全句前置路由守卫
  console.log(to)
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
