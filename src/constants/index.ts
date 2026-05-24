export const PROJECT_STATUS_MAP: Record<string, { label: string; type: '' | 'success' | 'warning' | 'info' | 'danger' }> = {
  planning: { label: '规划中', type: 'info' },
  active: { label: '进行中', type: '' },
  completed: { label: '已完成', type: 'success' },
  archived: { label: '已归档', type: 'warning' },
}

export const TASK_STATUS_MAP: Record<string, { label: string; type: '' | 'success' | 'warning' | 'info' | 'danger' }> = {
  todo: { label: '待办', type: 'info' },
  in_progress: { label: '进行中', type: '' },
  review: { label: '待审核', type: 'warning' },
  done: { label: '已完成', type: 'success' },
}

export const TASK_PRIORITY_MAP: Record<string, { label: string; type: '' | 'success' | 'warning' | 'info' | 'danger' }> = {
  low: { label: '低', type: 'info' },
  medium: { label: '中', type: '' },
  high: { label: '高', type: 'warning' },
  urgent: { label: '紧急', type: 'danger' },
}

export const USER_ROLE_MAP: Record<string, string> = {
  admin: '管理员',
  manager: '项目经理',
  member: '成员',
}
