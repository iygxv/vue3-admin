import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登陆',
    },
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: '系统首页',
    },
    component: () => import('@/layouts/index.vue'),
  },
]