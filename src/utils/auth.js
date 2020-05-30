import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUser(userInfo) {
  Cookies.set('userName', userInfo.user.number)
  Cookies.set('name', userInfo.user.name)
  Cookies.set('head', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
  // console.log(userInfo.user.id)
  Cookies.set('userId', userInfo.user.id)
  Cookies.set('loginTime', userInfo.user.loginTime)
}

export function getUser(type) {
  const userInfo = {}
  userInfo.userName = Cookies.get('userName')
  userInfo.name = Cookies.get('name')
  userInfo.head = Cookies.get('head')
  userInfo.userId = Cookies.get('userId')
  userInfo.loginTime = Cookies.get('loginTime')
  // console.log(userInfo)
  return userInfo
}
