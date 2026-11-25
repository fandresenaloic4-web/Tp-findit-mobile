<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="naviguer('/accueil')">Retour</ion-button>
        </ion-buttons>
        <ion-title>Connexion</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form class="formulaire" @submit.prevent="connecter">
        <h1>Connexion</h1>
        <p>Connectez-vous pour retrouver vos objets.</p>

        <ion-item>
          <ion-label position="stacked">Adresse e-mail</ion-label>
          <ion-input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="vous@exemple.com"
          />
        </ion-item>
        <ion-text v-if="erreurs.email" color="danger">
          <p class="erreur">{{ erreurs.email }}</p>
        </ion-text>

        <ion-item>
          <ion-label position="stacked">Mot de passe</ion-label>
          <ion-input
            v-model="motDePasse"
            type="password"
            autocomplete="current-password"
            placeholder="Votre mot de passe"
          />
        </ion-item>
        <ion-text v-if="erreurs.motDePasse" color="danger">
          <p class="erreur">{{ erreurs.motDePasse }}</p>
        </ion-text>

        <ion-text v-if="error" color="danger">
          <p class="erreur">{{ error }}</p>
        </ion-text>

        <ion-button type="submit" expand="block" :disabled="loading">
          <ion-spinner v-if="loading" slot="start" name="dots" />
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </ion-button>

        <ion-button fill="clear" expand="block" @click="naviguer('/inscription')">
          Pas encore de compte ? Inscrivez-vous
        </ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonSpinner,
  useIonRouter
} from '@ionic/vue';

import { useAuth } from '../composables/useAuth';
import {
  validerFormulaireConnexion,
  type ErreursFormulaire
} from '../utils/validation';

const ionRouter = useIonRouter();
const route = useRoute();
const { login, loading, error, clearError } = useAuth();

const email = ref('');
const motDePasse = ref('');
const erreurs = ref<ErreursFormulaire>({});

const naviguer = (chemin: string) => {
  clearError();
  ionRouter.push(chemin);
};

const connecter = async () => {
  clearError();
  erreurs.value = validerFormulaireConnexion(email.value, motDePasse.value);

  if (Object.keys(erreurs.value).length > 0) {
    return;
  }

  try {
    await login(email.value.trim(), motDePasse.value);

    // La redirection vers la page d'accueil se fait après la connexion.
    const redirect = route.query.redirect;
    const cible = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
      ? redirect
      : '/accueil';

    ionRouter.push(cible);
  } catch {
    // Le message d'erreur est affiché via authStore.error.
  }
};
</script>

<style scoped>
.formulaire {
  max-width: 480px;
  margin: 0 auto;
  padding-top: 2rem;
}

.formulaire h1 {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.formulaire p {
  color: var(--ion-color-medium);
}

.erreur {
  margin: 0.25rem 0 0.75rem;
  font-size: 0.85rem;
}

ion-item {
  margin-bottom: 0.25rem;
}

ion-button[type='submit'] {
  margin-top: 1.5rem;
}
</style>
