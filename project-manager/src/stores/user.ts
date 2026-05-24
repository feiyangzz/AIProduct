import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { authApi } from '@/api'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref(localStorage.getItem('pm_token') || '')

  function initFromStorage() {
    const raw = localStorage.getItem('pm_user')
    if (raw) {
      user.value = JSON.parse(raw) as User
    }
  }

  async function login(username: string, password: string) {
    const res = await authApi.login({ username, password })
    if (res.code !== 0) throw new Error(res.message)
    user.value = res.data.user
    token.value = res.data.token
    return res.data
  }

  async function logout() {
    await authApi.logout()
    user.value = null
    token.value = ''
  }

  const isLoggedIn = () => !!token.value

  initFromStorage()

  return { user, token, login, logout, isLoggedIn }
})
