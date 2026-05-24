import { describe, it, expect, beforeEach } from 'vitest'
import { mockDb } from '../../mock/db'
import * as projectHandler from '../../mock/handlers/project'
import type { ProjectForm } from '@/types'

const sampleForm: ProjectForm = {
  name: '测试项目',
  description: '自动化测试创建',
  status: 'planning',
  ownerId: 1,
  memberIds: [1, 2],
  startDate: '2026-05-01',
  endDate: '2026-12-31',
}

describe('project mock handlers', () => {
  beforeEach(() => {
    mockDb.reset()
  })

  it('获取项目列表', () => {
    const res = projectHandler.getProjects()
    expect(res.code).toBe(0)
    expect(res.data?.length).toBeGreaterThan(0)
  })

  it('创建项目', () => {
    const before = mockDb.get().projects.length
    const res = projectHandler.createProject(sampleForm)
    expect(res.code).toBe(0)
    expect(res.data?.name).toBe('测试项目')
    expect(mockDb.get().projects.length).toBe(before + 1)
  })

  it('更新项目', () => {
    const created = projectHandler.createProject(sampleForm)
    const id = created.data!.id
    const res = projectHandler.updateProject(id, { name: '已更新项目' })
    expect(res.code).toBe(0)
    expect(res.data?.name).toBe('已更新项目')
  })

  it('删除项目并级联删除关联任务', () => {
    const projectId = 1
    const tasksBefore = mockDb.get().tasks.filter((t) => t.projectId === projectId).length
    expect(tasksBefore).toBeGreaterThan(0)

    const res = projectHandler.deleteProject(projectId)
    expect(res.code).toBe(0)
    expect(mockDb.get().projects.find((p) => p.id === projectId)).toBeUndefined()
    expect(mockDb.get().tasks.filter((t) => t.projectId === projectId).length).toBe(0)
  })

  it('更新不存在的项目返回失败', () => {
    const res = projectHandler.updateProject(9999, { name: 'x' })
    expect(res.code).toBe(1)
    expect(res.message).toBe('项目不存在')
  })
})
