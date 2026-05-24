import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

vi.mock('@/api', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}))

import { authApi } from '@/api'

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('登录成功后写入用户与 token', async () => {
    const mockUser = {
      id: 1,
      username: 'admin',
      name: '管理员',
      avatar: '',
      role: '项目经理',
      email: 'admin@example.com',
    }
    vi.mocked(authApi.login).mockResolvedValue({ token: 'mock-token-1-1', user: mockUser })

    const store = useUserStore()
    await store.login('admin', '123456')

    expect(store.user?.name).toBe('管理员')
    expect(store.token).toBe('mock-token-1-1')
    expect(localStorage.getItem('pm_token')).toBe('mock-token-1-1')
  })

  it('退出登录后清空状态', async () => {
    vi.mocked(authApi.logout).mockResolvedValue(null)
    localStorage.setItem('pm_token', 'token')
    localStorage.setItem('pm_user', JSON.stringify({ id: 1 }))

    const store = useUserStore()
    store.token = 'token'
    await store.logout()

    expect(store.user).toBeNull()
    expect(store.token).toBe('')
    expect(localStorage.getItem('pm_token')).toBeNull()
  })

  it('isLoggedIn 根据 token 判断', () => {
    const store = useUserStore()
    expect(store.isLoggedIn()).toBe(false)
    store.token = 'abc'
    expect(store.isLoggedIn()).toBe(true)
  })
})
