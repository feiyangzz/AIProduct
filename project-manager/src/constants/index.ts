import type { ProjectStatus, TaskPriority, TaskStatus } from '@/types'

export const PROJECT_STATUS_MAP: Record<
  ProjectStatus,
  { label: string; type: 'info' | 'primary' | 'success' | 'warning' }
> = {
  planning: { label: '规划中', type: 'info' as const },
  active: { label: '进行中', type: 'primary' as const },
  completed: { label: '已完成', type: 'success' as const },
  archived: { label: '已归档', type: 'warning' as const },
}

export const TASK_STATUS_MAP: Record<
  TaskStatus,
  { label: string; type: 'info' | 'primary' | 'warning' | 'success'; color: string }
> = {
  todo: { label: '待办', type: 'info' as const, color: '#909399' },
  in_progress: { label: '进行中', type: 'primary' as const, color: '#409eff' },
  review: { label: '评审中', type: 'warning' as const, color: '#e6a23c' },
  done: { label: '已完成', type: 'success' as const, color: '#67c23a' },
}

export const TASK_PRIORITY_MAP: Record<
  TaskPriority,
  { label: string; type: 'info' | '' | 'warning' | 'danger' }
> = {
  low: { label: '低', type: 'info' as const },
  medium: { label: '中', type: '' as const },
  high: { label: '高', type: 'warning' as const },
  urgent: { label: '紧急', type: 'danger' as const },
}

export const TASK_STATUS_ORDER: TaskStatus[] = ['todo', 'in_progress', 'review', 'done']
