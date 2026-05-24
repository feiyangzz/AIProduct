import { mockApi } from './mock'
import type { CreateProjectDto, CreateTaskDto, LoginForm, PageParams } from '@/types'

export const authApi = {
  login: (data: LoginForm) => mockApi.login(data),
  getCurrentUser: () => mockApi.getCurrentUser(),
}

export const dashboardApi = {
  getStats: () => mockApi.getDashboardStats(),
}

export const projectApi = {
  getList: (params: PageParams) => mockApi.getProjects(params),
  getDetail: (id: number) => mockApi.getProject(id),
  create: (data: CreateProjectDto) => mockApi.createProject(data),
  update: (id: number, data: Partial<CreateProjectDto>) => mockApi.updateProject(id, data),
  delete: (id: number) => mockApi.deleteProject(id),
}

export const taskApi = {
  getList: (params: PageParams & { projectId?: number; status?: string }) => mockApi.getTasks(params),
  create: (data: CreateTaskDto) => mockApi.createTask(data),
  update: (id: number, data: Partial<CreateTaskDto>) => mockApi.updateTask(id, data),
  delete: (id: number) => mockApi.deleteTask(id),
}

export const memberApi = {
  getList: () => mockApi.getMembers(),
}
