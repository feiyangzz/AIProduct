import { get, post, put, del } from '@/utils/request'
import type { DashboardStats, LoginForm, Project, ProjectForm, Task, TaskForm, User } from '@/types'

export const authApi = {
  login(form: LoginForm) {
    return post<{ token: string; user: User }>('/auth/login', form)
  },

  logout() {
    return post<null>('/auth/logout')
  },

  getCurrentUser() {
    return get<User>('/auth/me')
  },
}

export const projectApi = {
  getList() {
    return get<Project[]>('/projects')
  },

  getById(id: number) {
    return get<Project>(`/projects/${id}`)
  },

  create(form: ProjectForm) {
    return post<Project>('/projects', form)
  },

  update(id: number, form: Partial<ProjectForm>) {
    return put<Project>(`/projects/${id}`, form)
  },

  delete(id: number) {
    return del<null>(`/projects/${id}`)
  },
}

export const taskApi = {
  getList(projectId?: number) {
    return get<Task[]>('/tasks', { params: projectId ? { projectId } : undefined })
  },

  create(form: TaskForm) {
    return post<Task>('/tasks', form)
  },

  update(id: number, form: Partial<TaskForm>) {
    return put<Task>(`/tasks/${id}`, form)
  },

  delete(id: number) {
    return del<null>(`/tasks/${id}`)
  },
}

export const teamApi = {
  getMembers() {
    return get<User[]>('/team/members')
  },
}

export const dashboardApi = {
  getStats() {
    return get<DashboardStats>('/dashboard/stats')
  },
}
