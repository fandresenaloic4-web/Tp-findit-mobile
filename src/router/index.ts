import { createRouter, createWebHistory } from '@ionic/vue-router';

const routes = [
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
    component: () => import('../pages/ConnexionPage.vue')
  },
  {
    path: '/inscription',
    name: 'Inscription',
    component: () => import('../pages/InscriptionPage.vue')
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
    component: () => import('../pages/PublierObjetPage.vue')
  },
  {
    path: '/recherche',
    name: 'Recherche',
    component: () => import('../pages/RecherchePage.vue')
  },
  {
    path: '/profil',
    name: 'Profil',
    component: () => import('../pages/ProfilPage.vue')
  },
  {
    path: '/profil/modifier',
    name: 'ModifierProfil',
    component: () => import('../pages/ModifierProfilPage.vue')
  },
  {
    path: '/conversations',
    name: 'Conversations',
    component: () => import('../pages/ConversationsPage.vue')
  },
  {
    path: '/discussion/:id',
    name: 'Discussion',
    component: () => import('../pages/DiscussionPage.vue')
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

export default router;
