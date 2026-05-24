import type { ApiResponse } from '../src/types'

export function success<T>(data: T, message = 'success'): ApiResponse<T> {
  return { code: 0, message, data }
}

export function fail<T = null>(message: string, code = 1): ApiResponse<T> {
  return { code, message, data: null as T }
}

export function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function withHandler<T>(handler: () => T, errorMessage = '操作失败'): ApiResponse<T> {
  try {
    return success(handler())
  } catch (e) {
    const message = e instanceof Error ? e.message : errorMessage
    return fail(message)
  }
}
