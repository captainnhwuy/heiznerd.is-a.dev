import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PomodoroTimer from '@/components/PomodoroTimer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/pomodoro',
      name: 'pomodoro',
      component: PomodoroTimer
    },
  ]
})

export default router
