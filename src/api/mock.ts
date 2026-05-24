import type {
  ApiResponse,
  CreateProjectDto,
  CreateTaskDto,
  DashboardStats,
  LoginForm,
  PageParams,
  PageResult,
  Project,
  Task,
  User,
} from '@/types'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

const mockUsers: User[] = [
  { id: 1, username: 'admin', name: '张管理', email: 'admin@example.com', role: 'admin' },
  { id: 2, username: 'manager', name: '李经理', email: 'manager@example.com', role: 'manager' },
  { id: 3, username: 'member', name: '王成员', email: 'member@example.com', role: 'member' },
  { id: 4, username: 'dev1', name: '赵开发', email: 'dev1@example.com', role: 'member' },
  { id: 5, username: 'dev2', name: '钱设计', email: 'dev2@example.com', role: 'member' },
]

let mockProjects: Project[] = [
  {
    id: 1,
    name: 'AI 智能助手平台',
    description: '基于大语言模型的企业级智能助手平台，支持多模态交互与知识库管理。',
    status: 'active',
    progress: 65,
    ownerId: 2,
    memberIds: [2, 3, 4],
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-05-20T10:00:00Z',
  },
  {
    id: 2,
    name: '移动端 App 重构',
    description: '使用 Vue3 + Capacitor 重构现有移动端应用，提升性能和用户体验。',
    status: 'active',
    progress: 40,
    ownerId: 2,
    memberIds: [3, 5],
    startDate: '2025-03-01',
    endDate: '2025-08-31',
    createdAt: '2025-02-20T08:00:00Z',
    updatedAt: '2025-05-18T14:00:00Z',
  },
  {
    id: 3,
    name: '数据中台建设',
    description: '构建统一的数据中台，实现数据采集、清洗、分析和可视化。',
    status: 'planning',
    progress: 10,
    ownerId: 1,
    memberIds: [1, 4],
    startDate: '2025-06-01',
    endDate: '2025-12-31',
    createdAt: '2025-05-01T08:00:00Z',
    updatedAt: '2025-05-15T09:00:00Z',
  },
  {
    id: 4,
    name: '官网改版',
    description: '企业官网全面改版，采用现代化设计风格，优化 SEO 和加载性能。',
    status: 'completed',
    progress: 100,
    ownerId: 2,
    memberIds: [3, 5],
    startDate: '2024-10-01',
    endDate: '2025-02-28',
    createdAt: '2024-09-15T08:00:00Z',
    updatedAt: '2025-02-28T18:00:00Z',
  },
]

let mockTasks: Task[] = [
  { id: 1, projectId: 1, title: '设计系统架构', description: '完成整体架构设计文档', status: 'done', priority: 'high', assigneeId: 2, dueDate: '2025-02-01', createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-02-01T10:00:00Z' },
  { id: 2, projectId: 1, title: '实现用户认证模块', description: 'JWT + OAuth2 登录', status: 'done', priority: 'high', assigneeId: 4, dueDate: '2025-03-01', createdAt: '2025-02-01T08:00:00Z', updatedAt: '2025-03-01T12:00:00Z' },
  { id: 3, projectId: 1, title: '对话引擎开发', description: '集成 LLM API，实现流式对话', status: 'in_progress', priority: 'urgent', assigneeId: 4, dueDate: '2025-05-30', createdAt: '2025-03-15T08:00:00Z', updatedAt: '2025-05-20T09:00:00Z' },
  { id: 4, projectId: 1, title: '知识库管理功能', description: '文档上传、向量化、检索', status: 'in_progress', priority: 'high', assigneeId: 3, dueDate: '2025-06-15', createdAt: '2025-04-01T08:00:00Z', updatedAt: '2025-05-19T11:00:00Z' },
  { id: 5, projectId: 1, title: '前端 UI 开发', description: '聊天界面和管理后台', status: 'review', priority: 'medium', assigneeId: 3, dueDate: '2025-06-01', createdAt: '2025-04-15T08:00:00:00Z', updatedAt: '2025-05-21T15:00:00Z' },
  { id: 6, projectId: 2, title: '技术选型评估', description: 'Capacitor vs React Native', status: 'done', priority: 'medium', assigneeId: 2, dueDate: '2025-03-15', createdAt: '2025-03-01T08:00:00Z', updatedAt: '2025-03-14T16:00:00Z' },
  { id: 7, projectId: 2, title: '核心页面迁移', description: '首页、登录、个人中心', status: 'in_progress', priority: 'high', assigneeId: 3, dueDate: '2025-06-30', createdAt: '2025-04-01T08:00:00Z', updatedAt: '2025-05-20T10:00:00Z' },
  { id: 8, projectId: 2, title: '性能优化', description: '首屏加载、内存占用优化', status: 'todo', priority: 'medium', assigneeId: 5, dueDate: '2025-08-15', createdAt: '2025-05-01T08:00:00Z', updatedAt: '2025-05-01T08:00:00Z' },
  { id: 9, projectId: 3, title: '需求调研', description: '各部门数据需求收集', status: 'in_progress', priority: 'high', assigneeId: 1, dueDate: '2025-06-15', createdAt: '2025-05-01T08:00:00Z', updatedAt: '2025-05-18T09:00:00Z' },
  { id: 10, projectId: 3, title: '技术方案设计', description: '数据架构和技术栈选型', status: 'todo', priority: 'high', assigneeId: 4, dueDate: '2025-07-01', createdAt: '2025-05-10T08:00:00Z', updatedAt: '2025-05-10T08:00:00Z' },
]

let nextProjectId = 5
let nextTaskId = 11

function ok<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

export const mockApi = {
  async login(form: LoginForm) {
    await delay()
    const user = mockUsers.find((u) => u.username === form.username)
    if (!user || form.password !== '123456') {
      throw { response: { data: { message: '用户名或密码错误' } } }
    }
    return ok({ token: 'mock-jwt-token', user })
  },

  async getCurrentUser() {
    await delay()
    return ok(mockUsers[0])
  },

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await delay()
    const activeProjects = mockProjects.filter((p) => p.status === 'active').length
    const completedTasks = mockTasks.filter((t) => t.status === 'done').length
    const overdueTasks = mockTasks.filter(
      (t) => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < new Date(),
    ).length
    return ok({
      totalProjects: mockProjects.length,
      activeProjects,
      totalTasks: mockTasks.length,
      completedTasks,
      teamMembers: mockUsers.length,
      overdueTasks,
    })
  },

  async getProjects(params: PageParams): Promise<ApiResponse<PageResult<Project>>> {
    await delay()
    let list = [...mockProjects]
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw),
      )
    }
    const start = (params.page - 1) * params.pageSize
    return ok({ list: list.slice(start, start + params.pageSize), total: list.length, page: params.page, pageSize: params.pageSize })
  },

  async getProject(id: number) {
    await delay()
    const project = mockProjects.find((p) => p.id === id)
    if (!project) throw { response: { data: { message: '项目不存在' } } }
    return ok(project)
  },

  async createProject(dto: CreateProjectDto) {
    await delay()
    const now = new Date().toISOString()
    const project: Project = {
      id: nextProjectId++,
      ...dto,
      progress: 0,
      ownerId: 1,
      createdAt: now,
      updatedAt: now,
    }
    mockProjects.unshift(project)
    return ok(project)
  },

  async updateProject(id: number, dto: Partial<CreateProjectDto>) {
    await delay()
    const index = mockProjects.findIndex((p) => p.id === id)
    if (index === -1) throw { response: { data: { message: '项目不存在' } } }
    mockProjects[index] = { ...mockProjects[index], ...dto, updatedAt: new Date().toISOString() }
    return ok(mockProjects[index])
  },

  async deleteProject(id: number) {
    await delay()
    mockProjects = mockProjects.filter((p) => p.id !== id)
    mockTasks = mockTasks.filter((t) => t.projectId !== id)
    return ok(null)
  },

  async getTasks(params: PageParams & { projectId?: number; status?: string }) {
    await delay()
    let list = [...mockTasks]
    if (params.projectId) list = list.filter((t) => t.projectId === params.projectId)
    if (params.status) list = list.filter((t) => t.status === params.status)
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      list = list.filter((t) => t.title.toLowerCase().includes(kw))
    }
    const start = (params.page - 1) * params.pageSize
    return ok({ list: list.slice(start, start + params.pageSize), total: list.length, page: params.page, pageSize: params.pageSize })
  },

  async createTask(dto: CreateTaskDto) {
    await delay()
    const now = new Date().toISOString()
    const task: Task = { id: nextTaskId++, ...dto, createdAt: now, updatedAt: now }
    mockTasks.unshift(task)
    return ok(task)
  },

  async updateTask(id: number, dto: Partial<CreateTaskDto>) {
    await delay()
    const index = mockTasks.findIndex((t) => t.id === id)
    if (index === -1) throw { response: { data: { message: '任务不存在' } } }
    mockTasks[index] = { ...mockTasks[index], ...dto, updatedAt: new Date().toISOString() }
    return ok(mockTasks[index])
  },

  async deleteTask(id: number) {
    await delay()
    mockTasks = mockTasks.filter((t) => t.id !== id)
    return ok(null)
  },

  async getMembers() {
    await delay()
    return ok(mockUsers)
  },
}
