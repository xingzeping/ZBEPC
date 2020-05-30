import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authentication'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.status !== 200) {
      let msg = ''
      if (res.message !== undefined && res.message.length > 0 && typeof res.message === 'object') {
        res.message.forEach((item, index) => {
          if (index === 0) {
            msg += item.message
          } else {
            msg += ';' + item.message
          }
        })
      } else if (res.message !== undefined && typeof res.message === 'string') {
        msg = res.message
      }
      console.log('msg', msg)
      //    Message({
      //      message: msg,
      //      type: 'error',
      //      duration: 5 * 1000
      //    })
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if ((res.status == 401 || res.status == 402) && msg != '用户名或密码错误') {
        MessageBox.alert(
          '登录信息过期，请重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            callback: action => {
              store.dispatch('FedLogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            }
          }
        )
      }
      if (res.status === 403) {
        Message({
          message: '权限不足!',
          type: 'error',
          duration: 10 * 1000
        })
      }
      return Promise.reject(msg)
    } else {
      return response.data
    }
  },
  error => {
    console.log(error.response) // for debug
    if (error.response.data.status !== undefined && error.response.data.status === 401) {
      MessageBox.alert(
        '登录信息过期，请重新登录',
        '确定登出',
        {
          confirmButtonText: '重新登录',
          callback: action => {
            store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          }
        }
      )
    } else {
      Message({
        message: '系统问题，请联系管理员',
        type: 'error',
        duration: 10 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
