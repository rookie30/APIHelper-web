import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'auth/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: 'api/user/userInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: 'auth/logout',
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: 'api/user/register',
    method: 'post',
    data
  })
}

// 修改密码
export function changePwd(data) {
  return request({
    url: 'api/user/changePwd',
    method: 'post',
    data
  })
}

// 更新个人信息
export function editInfo(data) {
  return request({
    url: 'api/user/editInfo',
    method: 'post',
    data
  })
}
