import type { Project, ProjectForm } from '../../src/types'
import { mockDb } from '../db'
import { withHandler } from '../utils'

export function getProjects() {
  return withHandler(() => mockDb.get().projects)
}

export function getProjectById(id: number) {
  return withHandler(() => {
    const project = mockDb.get().projects.find((p) => p.id === id)
    if (!project) throw new Error('项目不存在')
    return project
  })
}

export function createProject(form: ProjectForm) {
  return withHandler(() => {
    const db = mockDb.get()
    const project: Project = {
      id: db.nextProjectId++,
      ...form,
      progress: form.status === 'completed' ? 100 : 0,
      createdAt: new Date().toISOString(),
    }
    db.projects.unshift(project)
    mockDb.save(db)
    return project
  }, '创建项目失败')
}

export function updateProject(id: number, form: Partial<ProjectForm>) {
  return withHandler(() => {
    const db = mockDb.get()
    const index = db.projects.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('项目不存在')
    db.projects[index] = { ...db.projects[index], ...form }
    mockDb.save(db)
    return db.projects[index]
  }, '更新项目失败')
}

export function deleteProject(id: number) {
  return withHandler(() => {
    const db = mockDb.get()
    db.projects = db.projects.filter((p) => p.id !== id)
    db.tasks = db.tasks.filter((t) => t.projectId !== id)
    mockDb.save(db)
    return null
  }, '删除项目失败')
}
