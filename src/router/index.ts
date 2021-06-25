import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

import Callback from '../views/Callback.vue'
import ErrorPage from '../views/Error.vue'

import { routeGuard } from '@/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    beforeEnter: (to, from, next) => routeGuard(to, from, next),
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback,
  },
  {
    path: '/error',
    name: 'Error',
    component: ErrorPage,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
