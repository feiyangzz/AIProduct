import type {
  ApiResponse,
  DashboardStats,
  LoginForm,
  Project,
  ProjectForm,
  Task,
  TaskForm,
  User,
} from '@/types'
import { delay, mockDb, VALID_PASSWORD } from '@/mock/data'

function success<T>(data: T, message = 'success'): ApiResponse<T> {
  return { code: 0, message, data }
}

function fail(message: string, code = 1): ApiResponse<null> {
  return { code, message, data: null }
}

export async function mockRequest<T>(
  handler: () => T | Promise<T>,
  errorMessage = '操作失败',
): Promise<ApiResponse<T>> {
  await delay()
  try {
    const data = await handler()
    return success(data)
  } catch (e) {
    const message = e instanceof Error ? e.message : errorMessage
    return fail(message) as ApiResponse<T>
  }
}

export const authApi = {
  login(form: LoginForm) {
    return mockRequest(() => {
      const db = mockDb.get()
      const user = db.users.find((u) => u.username === form.username)
      if (!user || form.password !== VALID_PASSWORD) {
        throw new Error('用户名或密码错误')
      }
      const token = `mock-token-${user.id}-${Date.now()}`
      localStorage.setItem('pm_token', token)
      localStorage.setItem('pm_user', JSON.stringify(user))
      return { token, user }
    })
  },

  logout() {
    return mockRequest(() => {
      localStorage.removeItem('pm_token')
      localStorage.removeItem('pm_user')
      return null
    })
  },

  getCurrentUser() {
    return mockRequest(() => {
      const raw = localStorage.getItem('pm_user')
      if (!raw) throw new Error('未登录')
      return JSON.parse(raw) as User
    })
  },
}

export const projectApi = {
  getList() {
    return mockRequest(() => mockDb.get().projects)
  },

  getById(id: number) {
    return mockRequest(() => {
      const project = mockDb.get().projects.find((p) => p.id === id)
      if (!project) throw new Error('项目不存在')
      return project
    })
  },

  create(form: ProjectForm) {
    return mockRequest(() => {
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
  },

  update(id: number, form: Partial<ProjectForm>) {
    return mockRequest(() => {
      const db = mockDb.get()
      const index = db.projects.findIndex((p) => p.id === id)
      if (index === -1) throw new Error('项目不存在')
      db.projects[index] = { ...db.projects[index], ...form }
      mockDb.save(db)
      return db.projects[index]
    }, '更新项目失败')
  },

  delete(id: number) {
    return mockRequest(() => {
      const db = mockDb.get()
      db.projects = db.projects.filter((p) => p.id !== id)
      db.tasks = db.tasks.filter((t) => t.projectId !== id)
      mockDb.save(db)
      return null
    }, '删除项目失败')
  },
}

export const taskApi = {
  getList(projectId?: number) {
    return mockRequest(() => {
      const tasks = mockDb.get().tasks
      return projectId ? tasks.filter((t) => t.projectId === projectId) : tasks
    })
  },

  create(form: TaskForm) {
    return mockRequest(() => {
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
  },

  update(id: number, form: Partial<TaskForm>) {
    return mockRequest(() => {
      const db = mockDb.get()
      const index = db.tasks.findIndex((t) => t.id === id)
      if (index === -1) throw new Error('任务不存在')
      db.tasks[index] = { ...db.tasks[index], ...form }
      mockDb.save(db)
      return db.tasks[index]
    }, '更新任务失败')
  },

  delete(id: number) {
    return mockRequest(() => {
      const db = mockDb.get()
      db.tasks = db.tasks.filter((t) => t.id !== id)
      mockDb.save(db)
      return null
    }, '删除任务失败')
  },
}

export const teamApi = {
  getMembers() {
    return mockRequest(() => mockDb.get().users)
  },
}

export const dashboardApi = {
  getStats() {
    return mockRequest((): DashboardStats => {
      const db = mockDb.get()
      return {
        totalProjects: db.projects.length,
        activeProjects: db.projects.filter((p) => p.status === 'active').length,
        totalTasks: db.tasks.length,
        completedTasks: db.tasks.filter((t) => t.status === 'done').length,
        teamMembers: db.users.length,
      }
    })
  },
}
