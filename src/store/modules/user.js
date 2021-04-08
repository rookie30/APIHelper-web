import { login, logout, getInfo } from '@/api/system/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { encrypt } from '@/utils/rsaEncrypt'
const user = {
  state: {
    token: getToken(),
    user: {}
  },

  mutations: {
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_USER: (state, user) => {
      let userInfo = user
      state.user = userInfo
      window.sessionStorage.setItem("user", JSON.stringify(userInfo))
    }
  },
  
  actions: {
    // user login
    Login({ commit }, userInfo) {
      const rememberMe = userInfo.rememberMe
        return new Promise((resolve, reject) => {
          login(userInfo).then(res => {
            setToken(res.token, rememberMe)
            commit('SET_TOKEN', res.token)
            commit('SET_USER', res.user.user)
            // setUserInfo(res.user, commit)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
    },
  
    // get user info
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          // const { data } = response
  
          // if (!data) {
          //   return reject('Verification failed, please Login again.')
          // }
          console.log(response);
          commit('SET_USER', response)
          // const { name, avatar } = data
          
          // commit('SET_NAME', name)
          // commit('SET_AVATAR', avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  
    // user logout
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then((res) => {
          LogOut(commit)
          removeToken() // must remove  token  first
          // resetRouter()
          // commit('RESET_STATE')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  
    // remove token
    resetToken({ commit }) {
      return new Promise(resolve => {
        removeToken() // must remove  token  first
        commit('RESET_STATE')
        resolve()
      })
    },
  }
}

export const LogOut = (commit) => {
  commit('SET_TOKEN', '')
  removeToken()
  window.sessionStorage.removeItem('user')
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }
  commit('SET_USER', res.user)
}

export default user
