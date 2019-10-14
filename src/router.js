import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login.vue'
import Index from './components/index.vue'

Vue.use(Router)

export default new Router({
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
