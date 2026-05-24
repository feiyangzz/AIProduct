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
    const data = await authApi.login({ username, password })
    user.value = data.user
    token.value = data.token
    localStorage.setItem('pm_token', data.token)
    localStorage.setItem('pm_user', JSON.stringify(data.user))
    return data
  }

  async function logout() {
    await authApi.logout()
    user.value = null
    token.value = ''
    localStorage.removeItem('pm_token')
    localStorage.removeItem('pm_user')
  }

  const isLoggedIn = () => !!token.value

  initFromStorage()

  return { user, token, login, logout, isLoggedIn }
})
