import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/request'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录', public: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '仪表盘', icon: 'Odometer' },
        },
        {
          path: 'projects',
          name: 'Projects',
          component: () => import('@/views/projects/index.vue'),
          meta: { title: '项目管理', icon: 'Folder' },
        },
        {
          path: 'projects/:id',
          name: 'ProjectDetail',
          component: () => import('@/views/projects/detail.vue'),
          meta: { title: '项目详情', hidden: true },
        },
        {
          path: 'tasks',
          name: 'Tasks',
          component: () => import('@/views/tasks/index.vue'),
          meta: { title: '任务管理', icon: 'List' },
        },
        {
          path: 'members',
          name: 'Members',
          component: () => import('@/views/members/index.vue'),
          meta: { title: '团队成员', icon: 'User' },
        },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || '项目管理系统'} - PM System`
  if (to.meta.public) {
    next()
    return
  }
  if (!getToken()) {
    next('/login')
    return
  }
  next()
})

export default router
