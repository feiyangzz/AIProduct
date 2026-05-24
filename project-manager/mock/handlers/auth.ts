import type { LoginForm, User } from '../../src/types'
import { mockDb, VALID_PASSWORD } from '../db'
import { withHandler } from '../utils'

export function login(body: LoginForm) {
  return withHandler(() => {
    const user = mockDb.get().users.find((u) => u.username === body.username)
    if (!user || body.password !== VALID_PASSWORD) {
      throw new Error('用户名或密码错误')
    }
    const token = `mock-token-${user.id}-${Date.now()}`
    return { token, user }
  }, '登录失败')
}

export function logout() {
  return withHandler(() => null, '退出失败')
}

export function getCurrentUser(body?: { token?: string }) {
  return withHandler(() => {
    const token = body?.token
    if (!token) throw new Error('未登录')
    const match = token.match(/^mock-token-(\d+)-/)
    if (!match) throw new Error('无效 token')
    const userId = Number(match[1])
    const user = mockDb.get().users.find((u) => u.id === userId)
    if (!user) throw new Error('用户不存在')
    return user as User
  }, '获取用户信息失败')
}
