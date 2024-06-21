import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../Pages/Home/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: "Main"
      }
    },
    {
      path: '/table',
      name: 'table',
      component: () => import('../Pages/Journal/index.vue'),
      meta: {
        title: "Таблица"
      },
      children: [
        {
          path: ":pid",
          component: () => import('../Pages/Journal/index.vue'),
        }
      ]
    }
  ]
})

export default router
