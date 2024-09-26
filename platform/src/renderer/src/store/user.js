import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      id: '',
      name: '',
      email: '',
      role: '',
      avatar: '',
      token: ''
    },

    rememberMe: false,
    isLogin: false,
    isLoginLoading: false,
    isLoginError: false,
    isLogoutLoading: false
  }),
  actions: {
    // 登录
    login(data) {
      this.user = data
      this.isLogin = true
      this.isLoginLoading = false
      this.isLoginError = false
    },
    // 登出
    logout() {
      this.user = {
        id: 0,
        name: '',
        email: '',
        role: '',
        avatar: '',
        token: '',
        refreshToken: ''
      }
      this.isLogin = false
      this.isLogoutLoading = false
    },
    setRememberMe(rememberMe) {
      this.rememberMe = rememberMe
    },
    setForgetEmail(email) {
      this.user.email = email
    }
  },
  persist: true // 持久化存储
})
export { useUserStore }
