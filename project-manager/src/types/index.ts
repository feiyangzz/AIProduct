export type ProjectStatus = 'planning' | 'active' | 'completed' | 'archived'
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface User {
  id: number
  username: string
  name: string
  avatar: string
  role: string
  email: string
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
}

export interface Task {
  id: number
  projectId: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: number | null
  dueDate: string
  createdAt: string
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

export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  totalTasks: number
  completedTasks: number
  teamMembers: number
}

export interface ProjectForm {
  name: string
  description: string
  status: ProjectStatus
  ownerId: number
  memberIds: number[]
  startDate: string
  endDate: string
}

export interface TaskForm {
  projectId: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: number | null
  dueDate: string
}
