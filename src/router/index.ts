import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

import { useAuthStore } from '../stores/authStore';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/accueil'
  },
  {
    path: '/accueil',
    name: 'Accueil',
    component: () => import('../pages/AccueilPage.vue')
  },
  {
    path: '/connexion',
    name: 'Connexion',
    component: () => import('../pages/ConnexionPage.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/inscription',
    name: 'Inscription',
    component: () => import('../pages/InscriptionPage.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/publications',
    name: 'Publications',
    component: () => import('../pages/ListePublicationsPage.vue')
  },
  {
    path: '/publication/:id',
    name: 'DetailPublication',
    component: () => import('../pages/DetailPublicationPage.vue')
  },
  {
    path: '/publier',
    name: 'PublierObjet',
    component: () => import('../pages/PublierObjetPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/recherche',
    name: 'Recherche',
    component: () => import('../pages/RecherchePage.vue')
  },
  {
    path: '/profil',
    name: 'Profil',
    component: () => import('../pages/ProfilPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profil/modifier',
    name: 'ModifierProfil',
    component: () => import('../pages/ModifierProfilPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/conversations',
    name: 'Conversations',
    component: () => import('../pages/ConversationsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/discussion/:id',
    name: 'Discussion',
    component: () => import('../pages/DiscussionPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/accueil'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Garde de route : la session est restaurée avant toute décision de navigation.
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  await authStore.waitForAuth();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'Connexion',
      query: { redirect: to.fullPath }
    };
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'Accueil' };
  }

  return true;
});

export default router;
