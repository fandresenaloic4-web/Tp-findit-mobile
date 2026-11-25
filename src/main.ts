import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';

// CSS principal d'Ionic
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/display.css';

// Thème de l'application
import './theme/variables.css';

const app = createApp(App);

const pinia = createPinia();

app.use(IonicVue);
app.use(pinia);

// Restauration de la session utilisateur dès le démarrage de l'application.
useAuthStore(pinia).initializeAuth();

app.use(router);

router.isReady().then(() => {
  app.mount('#app');
});
