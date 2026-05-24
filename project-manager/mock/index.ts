import type { MockMethod } from 'vite-plugin-mock'
import * as authHandler from './handlers/auth'
import * as projectHandler from './handlers/project'
import * as taskHandler from './handlers/task'
import * as dashboardHandler from './handlers/dashboard'

function parseAuthToken(headers: Record<string, string> = {}) {
  const auth = headers.authorization || headers.Authorization || ''
  return auth.replace(/^Bearer\s+/i, '')
}

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    timeout: 300,
    response: ({ body }) => authHandler.login(body),
  },
  {
    url: '/api/auth/logout',
    method: 'post',
    timeout: 200,
    response: () => authHandler.logout(),
  },
  {
    url: '/api/auth/me',
    method: 'get',
    timeout: 200,
    response: ({ headers }) =>
      authHandler.getCurrentUser({ token: parseAuthToken(headers as Record<string, string>) }),
  },
  {
    url: '/api/projects',
    method: 'get',
    timeout: 300,
    response: () => projectHandler.getProjects(),
  },
  {
    url: '/api/projects/:id',
    method: 'get',
    timeout: 200,
    response: ({ query }) => projectHandler.getProjectById(Number(query.id)),
  },
  {
    url: '/api/projects',
    method: 'post',
    timeout: 300,
    response: ({ body }) => projectHandler.createProject(body),
  },
  {
    url: '/api/projects/:id',
    method: 'put',
    timeout: 300,
    response: ({ query, body }) => projectHandler.updateProject(Number(query.id), body),
  },
  {
    url: '/api/projects/:id',
    method: 'delete',
    timeout: 300,
    response: ({ query }) => projectHandler.deleteProject(Number(query.id)),
  },
  {
    url: '/api/tasks',
    method: 'get',
    timeout: 300,
    response: ({ query }) =>
      taskHandler.getTasks(query.projectId ? Number(query.projectId) : undefined),
  },
  {
    url: '/api/tasks',
    method: 'post',
    timeout: 300,
    response: ({ body }) => taskHandler.createTask(body),
  },
  {
    url: '/api/tasks/:id',
    method: 'put',
    timeout: 300,
    response: ({ query, body }) => taskHandler.updateTask(Number(query.id), body),
  },
  {
    url: '/api/tasks/:id',
    method: 'delete',
    timeout: 300,
    response: ({ query }) => taskHandler.deleteTask(Number(query.id)),
  },
  {
    url: '/api/team/members',
    method: 'get',
    timeout: 200,
    response: () => dashboardHandler.getTeamMembers(),
  },
  {
    url: '/api/dashboard/stats',
    method: 'get',
    timeout: 200,
    response: () => dashboardHandler.getDashboardStats(),
  },
] as MockMethod[]

export { mockDb } from './db'
export { delay, success, fail, withHandler } from './utils'
