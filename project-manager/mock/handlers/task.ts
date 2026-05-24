import type { Task, TaskForm } from '../../src/types'
import { mockDb } from '../db'
import { withHandler } from '../utils'

export function getTasks(projectId?: number) {
  return withHandler(() => {
    const tasks = mockDb.get().tasks
    return projectId ? tasks.filter((t) => t.projectId === projectId) : tasks
  })
}

export function createTask(form: TaskForm) {
  return withHandler(() => {
    const db = mockDb.get()
    const task: Task = {
      id: db.nextTaskId++,
      ...form,
      createdAt: new Date().toISOString(),
    }
    db.tasks.unshift(task)
    mockDb.save(db)
    return task
  }, '创建任务失败')
}

export function updateTask(id: number, form: Partial<TaskForm>) {
  return withHandler(() => {
    const db = mockDb.get()
    const index = db.tasks.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('任务不存在')
    db.tasks[index] = { ...db.tasks[index], ...form }
    mockDb.save(db)
    return db.tasks[index]
  }, '更新任务失败')
}

export function deleteTask(id: number) {
  return withHandler(() => {
    const db = mockDb.get()
    db.tasks = db.tasks.filter((t) => t.id !== id)
    mockDb.save(db)
    return null
  }, '删除任务失败')
}
