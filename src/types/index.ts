export type ProjectStatus = 'planning' | 'active' | 'completed' | 'archived'
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface User {
  id: number
  username: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'manager' | 'member'
}

export interface Project {
  id: number
  name: string
  description: string
  status: ProjectStatus
  progress: number
  ownerId: number
  memberIds: number[]
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: number
  projectId: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: number
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface LoginForm {
  username: string
  password: string
}

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PageParams {
  page: number
  pageSize: number
  keyword?: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  totalTasks: number
  completedTasks: number
  teamMembers: number
  overdueTasks: number
}

export interface CreateProjectDto {
  name: string
  description: string
  status: ProjectStatus
  startDate: string
  endDate: string
  memberIds: number[]
}

export interface CreateTaskDto {
  projectId: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: number
  dueDate?: string
}
