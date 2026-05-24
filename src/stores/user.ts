import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api'
import { getToken, removeToken, setToken } from '@/utils/request'
import type { LoginForm, User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(getToken())
  const userInfo = ref<User | null>(null)

  async function login(form: LoginForm) {
    const res = await authApi.login(form)
    token.value = res.data.token
    userInfo.value = res.data.user
    setToken(res.data.token)
  }

  async function fetchUserInfo() {
    const res = await authApi.getCurrentUser()
    userInfo.value = res.data
  }

  function logout() {
    token.value = null
    userInfo.value = null
    removeToken()
  }

  return { token, userInfo, login, fetchUserInfo, logout }
})
