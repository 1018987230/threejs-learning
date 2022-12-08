import axios from 'axios'
// import router from "../router";

import { useRouter } from 'vue-router';
const router = useRouter()
export function request(config) {
  
  // 创建axios的实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8080/api',
    // baseURL: 'https://www.djboy.shop/api',
    timeout: 10000
  })
  // 请求拦截器配置
  instance.interceptors.request.use(config => {
      console.log(window.sessionStorage.getItem('token'))
      config.headers.token = window.sessionStorage.getItem('token')
      // config.headers.
      return config
    }, error => {
      console.log(error)
      return Promise.error(error)
    }
  )
  // 响应拦截器配置
  instance.interceptors.response.use(response => {
    if(response.data.resultCode == 4001){
      console.log("token验证失败！")
      router.push('/login')
    }
    return response
  }, error => {
    // switch (error.response.status) {
    //   case 401:
    //     console.log("无权访问")
    //     router.push({path: '/login'})
    //     break
    //   case 403:
    //     console.log("token过期啦")
    //     router.push({path: '/login'})
    //     break
    //   case 404:
    //     console.log("404啦")
    //     router.push({path: '/404'})
    //     break
    //   default:
    //     return Promise.reject(error)
    // }
    // return Promise.reject(error)
  })
  // 发送真正的网络请求
  return instance(config);
}
export default request