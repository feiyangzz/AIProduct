import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: { title: '仪表盘', icon: 'Odometer' },
        },
        {
          path: 'projects',
          name: 'Projects',
          component: () => import('@/views/projects/ProjectListView.vue'),
          meta: { title: '项目管理', icon: 'Folder' },
        },
        {
          path: 'tasks',
          name: 'Tasks',
          component: () => import('@/views/tasks/TaskBoardView.vue'),
          meta: { title: '任务看板', icon: 'List' },
        },
        {
          path: 'team',
          name: 'Team',
          component: () => import('@/views/team/TeamView.vue'),
          meta: { title: '团队成员', icon: 'User' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!to.meta.public && !userStore.isLoggedIn()) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.path === '/login' && userStore.isLoggedIn()) {
    return '/dashboard'
  }
})

export default router
