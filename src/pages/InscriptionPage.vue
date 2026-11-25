<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="naviguer('/accueil')">Retour</ion-button>
        </ion-buttons>
        <ion-title>Inscription</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form class="formulaire" @submit.prevent="inscrire">
        <h1>Créer un compte</h1>
        <p>Renseignez vos informations pour utiliser FindIt.</p>

        <ion-item>
          <ion-label position="stacked">Nom</ion-label>
          <ion-input
            v-model="nom"
            type="text"
            autocomplete="name"
            placeholder="Votre nom"
          />
        </ion-item>
        <ion-text v-if="erreurs.nom" color="danger">
          <p class="erreur">{{ erreurs.nom }}</p>
        </ion-text>

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
          <ion-label position="stacked">Numéro de téléphone</ion-label>
          <ion-input
            v-model="telephone"
            type="tel"
            autocomplete="tel"
            placeholder="0612345678"
          />
        </ion-item>
        <ion-text v-if="erreurs.telephone" color="danger">
          <p class="erreur">{{ erreurs.telephone }}</p>
        </ion-text>

        <ion-item>
          <ion-label position="stacked">Mot de passe</ion-label>
          <ion-input
            v-model="motDePasse"
            type="password"
            autocomplete="new-password"
            placeholder="6 caractères minimum"
          />
        </ion-item>
        <ion-text v-if="erreurs.motDePasse" color="danger">
          <p class="erreur">{{ erreurs.motDePasse }}</p>
        </ion-text>

        <ion-item>
          <ion-label position="stacked">Confirmer le mot de passe</ion-label>
          <ion-input
            v-model="confirmationMotDePasse"
            type="password"
            autocomplete="new-password"
            placeholder="Répétez le mot de passe"
          />
        </ion-item>
        <ion-text v-if="erreurs.confirmationMotDePasse" color="danger">
          <p class="erreur">{{ erreurs.confirmationMotDePasse }}</p>
        </ion-text>

        <ion-text v-if="error" color="danger">
          <p class="erreur">{{ error }}</p>
        </ion-text>

        <ion-button type="submit" expand="block" :disabled="loading">
          <ion-spinner v-if="loading" slot="start" name="dots" />
          {{ loading ? 'Inscription…' : 'Créer mon compte' }}
        </ion-button>

        <ion-button fill="clear" expand="block" @click="naviguer('/connexion')">
          Déjà un compte ? Se connecter
        </ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
  validerFormulaireInscription,
  type ErreursFormulaire
} from '../utils/validation';
import type { UserProfile } from '../services/authService';

const ionRouter = useIonRouter();
const { register, loading, error, clearError } = useAuth();

const nom = ref('');
const email = ref('');
const telephone = ref('');
const motDePasse = ref('');
const confirmationMotDePasse = ref('');
const erreurs = ref<ErreursFormulaire>({});

const naviguer = (chemin: string) => {
  clearError();
  ionRouter.push(chemin);
};

const inscrire = async () => {
  clearError();
  erreurs.value = validerFormulaireInscription(
    nom.value,
    email.value,
    telephone.value,
    motDePasse.value,
    confirmationMotDePasse.value
  );

  if (Object.keys(erreurs.value).length > 0) {
    return;
  }

  // Les champs du profil gardent les mêmes noms que dans firebase.sql.
  const profile: UserProfile = {
    nom: nom.value.trim(),
    email: email.value.trim(),
    telephone: telephone.value.trim(),
    photoUrl: ''
  };

  try {
    await register(email.value.trim(), motDePasse.value, profile);
    ionRouter.push('/accueil');
  } catch {
    // Le message d'erreur est affiché via authStore.error.
  }
};
</script>

<style scoped>
.formulaire {
  max-width: 480px;
  margin: 0 auto;
  padding-top: 1.5rem;
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
