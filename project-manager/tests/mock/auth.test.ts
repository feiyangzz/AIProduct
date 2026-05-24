import { describe, it, expect, beforeEach } from 'vitest'
import { mockDb, VALID_PASSWORD } from '../../mock/db'
import * as authHandler from '../../mock/handlers/auth'

describe('auth mock handlers', () => {
  beforeEach(() => {
    mockDb.reset()
  })

  it('登录成功返回 token 与用户信息', () => {
    const res = authHandler.login({ username: 'admin', password: VALID_PASSWORD })
    expect(res.code).toBe(0)
    expect(res.data?.token).toMatch(/^mock-token-1-/)
    expect(res.data?.user.username).toBe('admin')
  })

  it('密码错误时返回失败', () => {
    const res = authHandler.login({ username: 'admin', password: 'wrong' })
    expect(res.code).toBe(1)
    expect(res.message).toBe('用户名或密码错误')
  })

  it('用户不存在时返回失败', () => {
    const res = authHandler.login({ username: 'nobody', password: VALID_PASSWORD })
    expect(res.code).toBe(1)
  })

  it('有效 token 可获取当前用户', () => {
    const loginRes = authHandler.login({ username: 'admin', password: VALID_PASSWORD })
    const token = loginRes.data!.token
    const res = authHandler.getCurrentUser({ token })
    expect(res.code).toBe(0)
    expect(res.data?.name).toBe('管理员')
  })

  it('无效 token 返回失败', () => {
    const res = authHandler.getCurrentUser({ token: 'invalid' })
    expect(res.code).toBe(1)
  })
})
