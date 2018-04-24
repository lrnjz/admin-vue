import axios from 'axios'
import {getToken} from '@/assets/js/auth'
// export default axios.create({
//   baseURL: 'http://localhost:8888/api/private/v1/'
// })

// 定义一个插件对象
const httpPlugin = {}

const http = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1/'
  // 这里添加的请求体，任何请求都会把这个请求头带到服务器
  // 好处是：我们不需要在每一次请求非/login接口的时候手动加Authorization
  // headers: {
  //   Authorization: getToken()
  // }
})

http.interceptors.request.use(function (config) {
  console.log('请求进入拦截器了')
  console.log('在请求拦截器中拿到的config = ', config)

  if (config.url !== '/login') {
    // 通过config来为本次请求配置选项
    config.headers['Authorization'] = getToken()
  }
  // return config 就好比next()允许通过
  return config
}, function (error) {
  return Promise.reject(error)
})

// 为插件添加一个成员：Install
httpPlugin.install = function (Vue, options) {
  // 添加实例方法
  Vue.prototype.$http = http
}

// 导出插件对象
export default httpPlugin

// 在入口文件加载使插件生效
