import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, setUser, getUser } from '@/utils/auth'
import { Message } from 'element-ui'
// import qs from 'qs'
const qs = require('qs')
const user = {
  state: {
    token: getToken(),
    name: getUser().name,
    loginTime: getUser().loginTime,
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_LGINTIME: (state, time) => {
      state.loginTime = time
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
    	console.log('SET_ROLES',roles)
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(qs.stringify(userInfo)).then(response => {
          console.log(response)
          const data = response.data
          setToken(data.Authentication)
          response.data.user.loginTime = response.date
          setUser(response.data)
          commit('SET_LGINTIME', response.date)
          commit('SET_TOKEN', data.Authentication)
          commit('SET_NAME', data.user.name)
          commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
          resolve()
        }).catch(error => {
          reject(error)
        })
      }).catch(error => {
        Message.error(error)
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const roles = response.data
					console.log('xu',roles)
          if (roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }

//        commit('SET_NAME', data.name)
//        commit('SET_AVATAR', data.avatar)
//        commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
