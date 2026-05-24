import Mock from 'mockjs'
import type { Project, Task, User } from '../src/types'

export interface MockDatabase {
  users: User[]
  projects: Project[]
  tasks: Task[]
  nextProjectId: number
  nextTaskId: number
}

export const VALID_PASSWORD = '123456'

const initialUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    name: '管理员',
    avatar: Mock.Random.image('100x100', Mock.Random.color(), '#fff', 'Admin'),
    role: '项目经理',
    email: 'admin@example.com',
  },
  {
    id: 2,
    username: 'zhangsan',
    name: '张三',
    avatar: Mock.Random.image('100x100', Mock.Random.color(), '#fff', 'ZS'),
    role: '前端开发',
    email: 'zhangsan@example.com',
  },
  {
    id: 3,
    username: 'lisi',
    name: '李四',
    avatar: Mock.Random.image('100x100', Mock.Random.color(), '#fff', 'LS'),
    role: '后端开发',
    email: 'lisi@example.com',
  },
  {
    id: 4,
    username: 'wangwu',
    name: '王五',
    avatar: Mock.Random.image('100x100', Mock.Random.color(), '#fff', 'WW'),
    role: 'UI 设计师',
    email: 'wangwu@example.com',
  },
  {
    id: 5,
    username: 'zhaoliu',
    name: '赵六',
    avatar: Mock.Random.image('100x100', Mock.Random.color(), '#fff', 'ZL'),
    role: '测试工程师',
    email: 'zhaoliu@example.com',
  },
]

const initialProjects: Project[] = [
  {
    id: 1,
    name: '电商平台重构',
    description: '对现有电商平台进行技术栈升级与性能优化',
    status: 'active',
    progress: 65,
    ownerId: 1,
    memberIds: [1, 2, 3, 4],
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 2,
    name: '移动端 App 开发',
    description: '开发 iOS 与 Android 双端原生应用',
    status: 'planning',
    progress: 20,
    ownerId: 1,
    memberIds: [2, 4, 5],
    startDate: '2026-03-01',
    endDate: '2026-09-30',
    createdAt: '2026-02-20T08:00:00Z',
  },
  {
    id: 3,
    name: '数据中台建设',
    description: '搭建企业级数据中台，实现数据统一治理',
    status: 'active',
    progress: 45,
    ownerId: 1,
    memberIds: [3, 5],
    startDate: '2026-02-01',
    endDate: '2026-08-31',
    createdAt: '2026-01-25T08:00:00Z',
  },
  {
    id: 4,
    name: 'CRM 系统升级',
    description: '客户关系管理系统功能迭代与体验优化',
    status: 'completed',
    progress: 100,
    ownerId: 1,
    memberIds: [2, 3],
    startDate: '2025-09-01',
    endDate: '2026-01-31',
    createdAt: '2025-08-15T08:00:00Z',
  },
]

const initialTasks: Task[] = [
  {
    id: 1,
    projectId: 1,
    title: '首页性能优化',
    description: '优化首屏加载速度，目标 LCP < 2.5s',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 2,
    dueDate: '2026-04-15',
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 2,
    projectId: 1,
    title: '购物车模块重构',
    description: '使用 Pinia 重构购物车状态管理',
    status: 'todo',
    priority: 'medium',
    assigneeId: 2,
    dueDate: '2026-05-01',
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 3,
    projectId: 1,
    title: '支付接口对接',
    description: '对接微信支付与支付宝支付',
    status: 'review',
    priority: 'urgent',
    assigneeId: 3,
    dueDate: '2026-04-20',
    createdAt: '2026-02-15T08:00:00Z',
  },
  {
    id: 4,
    projectId: 2,
    title: 'UI 设计稿评审',
    description: '完成首页与个人中心设计稿',
    status: 'done',
    priority: 'medium',
    assigneeId: 4,
    dueDate: '2026-03-15',
    createdAt: '2026-02-25T08:00:00Z',
  },
  {
    id: 5,
    projectId: 2,
    title: '登录模块开发',
    description: '实现手机号与第三方登录',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 2,
    dueDate: '2026-04-30',
    createdAt: '2026-03-05T08:00:00Z',
  },
  {
    id: 6,
    projectId: 3,
    title: '数据模型设计',
    description: '设计核心数据实体与关系模型',
    status: 'done',
    priority: 'high',
    assigneeId: 3,
    dueDate: '2026-03-01',
    createdAt: '2026-02-05T08:00:00Z',
  },
  {
    id: 7,
    projectId: 3,
    title: 'ETL 流程搭建',
    description: '搭建数据抽取、转换、加载流程',
    status: 'in_progress',
    priority: 'medium',
    assigneeId: 5,
    dueDate: '2026-05-15',
    createdAt: '2026-03-01T08:00:00Z',
  },
]

function createDefaultDb(): MockDatabase {
  return {
    users: structuredClone(initialUsers),
    projects: structuredClone(initialProjects),
    tasks: structuredClone(initialTasks),
    nextProjectId: 5,
    nextTaskId: 8,
  }
}

let db: MockDatabase = createDefaultDb()

export const mockDb = {
  get(): MockDatabase {
    return db
  },

  save(next: MockDatabase) {
    db = next
  },

  reset() {
    db = createDefaultDb()
    return db
  },
}

export function generateMockProject(overrides: Partial<Project> = {}): Project {
  const data = Mock.mock({
    'name': '@ctitle(4, 10)项目',
    'description': '@cparagraph(1, 2)',
    'status|1': ['planning', 'active', 'completed', 'archived'],
    'progress|0-100': 1,
    'ownerId|1-5': 1,
    'startDate': '@date("yyyy-MM-dd")',
    'endDate': '@date("yyyy-MM-dd")',
  }) as Omit<Project, 'id' | 'memberIds' | 'createdAt'>

  return {
    id: mockDb.get().nextProjectId,
    memberIds: [1],
    createdAt: new Date().toISOString(),
    ...data,
    ...overrides,
  }
}
