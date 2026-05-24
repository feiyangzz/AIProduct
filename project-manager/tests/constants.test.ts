import { describe, it, expect } from 'vitest'
import { PROJECT_STATUS_MAP, TASK_PRIORITY_MAP, TASK_STATUS_MAP } from '@/constants'

describe('constants', () => {
  it('项目状态映射完整', () => {
    expect(Object.keys(PROJECT_STATUS_MAP)).toEqual(['planning', 'active', 'completed', 'archived'])
    expect(PROJECT_STATUS_MAP.active.label).toBe('进行中')
  })

  it('任务状态映射完整', () => {
    expect(Object.keys(TASK_STATUS_MAP)).toEqual(['todo', 'in_progress', 'review', 'done'])
  })

  it('任务优先级映射完整', () => {
    expect(Object.keys(TASK_PRIORITY_MAP)).toEqual(['low', 'medium', 'high', 'urgent'])
    expect(TASK_PRIORITY_MAP.urgent.label).toBe('紧急')
  })
})
