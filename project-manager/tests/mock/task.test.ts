import { describe, it, expect, beforeEach } from 'vitest'
import { mockDb } from '../../mock/db'
import * as taskHandler from '../../mock/handlers/task'
import type { TaskForm } from '@/types'

const sampleForm: TaskForm = {
  projectId: 1,
  title: '自动化测试任务',
  description: '由 Vitest 创建',
  status: 'todo',
  priority: 'medium',
  assigneeId: 2,
  dueDate: '2026-06-01',
}

describe('task mock handlers', () => {
  beforeEach(() => {
    mockDb.reset()
  })

  it('获取全部任务', () => {
    const res = taskHandler.getTasks()
    expect(res.code).toBe(0)
    expect(res.data?.length).toBeGreaterThan(0)
  })

  it('按项目筛选任务', () => {
    const res = taskHandler.getTasks(1)
    expect(res.code).toBe(0)
    expect(res.data?.every((t) => t.projectId === 1)).toBe(true)
  })

  it('创建任务', () => {
    const before = mockDb.get().tasks.length
    const res = taskHandler.createTask(sampleForm)
    expect(res.code).toBe(0)
    expect(res.data?.title).toBe('自动化测试任务')
    expect(mockDb.get().tasks.length).toBe(before + 1)
  })

  it('更新任务状态', () => {
    const created = taskHandler.createTask(sampleForm)
    const id = created.data!.id
    const res = taskHandler.updateTask(id, { status: 'done' })
    expect(res.code).toBe(0)
    expect(res.data?.status).toBe('done')
  })

  it('删除任务', () => {
    const created = taskHandler.createTask(sampleForm)
    const id = created.data!.id
    const res = taskHandler.deleteTask(id)
    expect(res.code).toBe(0)
    expect(mockDb.get().tasks.find((t) => t.id === id)).toBeUndefined()
  })
})
