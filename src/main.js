import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// 优化axios
Vue.prototype.$axios = axios

// 优化接口地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 配置请求拦截器 - 配置 token 每次带上token都很麻烦
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么   把token带上
  // console.log(config)  简化开发 ,一个项目配一次就可以了
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 配置响应回来的数据,返回的数据子res.data中
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  if (response.meta.status === 401) {
    router.push('/login')
    localStorage.removeItem('token')
    response.meta.msg = '登录状态已失效,请重新登陆'
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
