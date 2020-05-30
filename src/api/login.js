import request from '@/utils/request'

export function logout (Authentication) {
  return request({
	    url: '/AUTH/logout',
	    method: 'get',
	    params: { Authentication: Authentication }
  })
}

export function login (data) {
  return request({
    url: '/AUTH/login',
    method: 'post',
    data
  })
}

export function getInfo () {
  return request({
    url: '/AUTH/menu/getUserAllowMenusBySys/BEPS/',
    method: 'get'
  })
}
