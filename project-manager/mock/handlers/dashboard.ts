import type { DashboardStats } from '../../src/types'
import { mockDb } from '../db'
import { withHandler } from '../utils'

export function getTeamMembers() {
  return withHandler(() => mockDb.get().users)
}

export function getDashboardStats() {
  return withHandler((): DashboardStats => {
    const db = mockDb.get()
    return {
      totalProjects: db.projects.length,
      activeProjects: db.projects.filter((p) => p.status === 'active').length,
      totalTasks: db.tasks.length,
      completedTasks: db.tasks.filter((t) => t.status === 'done').length,
      teamMembers: db.users.length,
    }
  })
}
