import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../Pages/JournalTable/HomeView.vue'

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
      component: () => import('../Pages/JournalTable/index.vue'),
      meta: {
        title: "Таблица"
      },
      children: [
        {
          path: ":pid",
          component: () => import('../Pages/JournalTable/index.vue'),
        }
      ]
    }
  ]
})

export default router
