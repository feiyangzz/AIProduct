import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import LoginView from '@/views/login/LoginView.vue'
import { useUserStore } from '@/stores/user'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
  useRoute: () => ({ query: {} }),
}))

vi.mock('@/api', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}))

describe('LoginView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    push.mockClear()
    localStorage.clear()
  })

  it('渲染登录表单', () => {
    const wrapper = mount(LoginView, {
      global: { plugins: [ElementPlus] },
    })
    expect(wrapper.find('h1').text()).toBe('项目管理系统')
    expect(wrapper.find('input[placeholder="用户名"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="密码"]').exists()).toBe(true)
  })

  it('登录成功后跳转仪表盘', async () => {
    const wrapper = mount(LoginView, {
      global: { plugins: [ElementPlus] },
    })
    const store = useUserStore()
    const loginSpy = vi.spyOn(store, 'login').mockResolvedValue({
      token: 't',
      user: {
        id: 1,
        username: 'admin',
        name: '管理员',
        avatar: '',
        role: '项目经理',
        email: 'admin@example.com',
      },
    })

    await wrapper.find('.login-btn').trigger('click')
    await flushPromises()

    expect(loginSpy).toHaveBeenCalledWith('admin', '123456')
    expect(push).toHaveBeenCalledWith('/dashboard')
  })
})
