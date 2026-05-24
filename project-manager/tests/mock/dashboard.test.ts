import { describe, it, expect, beforeEach } from 'vitest'
import { mockDb } from '../../mock/db'
import { getDashboardStats } from '../../mock/handlers/dashboard'

describe('dashboard mock handlers', () => {
  beforeEach(() => {
    mockDb.reset()
  })

  it('返回正确的统计数据', () => {
    const db = mockDb.get()
    const res = getDashboardStats()
    expect(res.code).toBe(0)
    expect(res.data).toEqual({
      totalProjects: db.projects.length,
      activeProjects: db.projects.filter((p) => p.status === 'active').length,
      totalTasks: db.tasks.length,
      completedTasks: db.tasks.filter((t) => t.status === 'done').length,
      teamMembers: db.users.length,
    })
  })
})
