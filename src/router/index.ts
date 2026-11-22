import { createRouter, createWebHistory } from '@ionic/vue-router'
import TabsPage from '../views/TabsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: TabsPage,
      children: [
        { path: '', redirect: '/home' },
        { path: 'home', component: () => import('../views/HomePage.vue') },
        { path: 'publish', component: () => import('../views/PublishPage.vue') },
        { path: 'item/:id', component: () => import('../views/DetailPage.vue') },
        { path: 'profile', component: () => import('../views/ProfilePage.vue') },
      ],
    },
  ],
})

export default router
