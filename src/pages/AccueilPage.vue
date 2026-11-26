<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>FindIt</ion-title>
        <ion-buttons slot="end">
          <ion-button v-if="isAuthenticated" @click="deconnecter">
            Déconnexion
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="accueil">
        <h1>Retrouvez vos objets perdus</h1>
        <p>
          FindIt vous aide à publier un objet perdu ou retrouvé et à contacter
          la personne concernée.
        </p>

        <div v-if="loading" class="chargement">
          <ion-spinner name="dots" />
          <p>Restauration de la session…</p>
        </div>

        <div v-else-if="isAuthenticated" class="actions">
          <p class="bienvenue">
            Bienvenue {{ profile?.nom || user?.email }}
          </p>
          <ion-button expand="block" @click="naviguer('/publications')">
            Voir les publications
          </ion-button>
          <ion-button expand="block" fill="outline" @click="naviguer('/publier')">
            Publier un objet
          </ion-button>
          <ion-button expand="block" fill="clear" @click="naviguer('/profil')">
            Mon profil
          </ion-button>
        </div>

        <div v-else class="actions">
          <ion-button expand="block" @click="naviguer('/connexion')">
            Se connecter
          </ion-button>
          <ion-button expand="block" fill="outline" @click="naviguer('/inscription')">
            Créer un compte
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSpinner,
  useIonRouter
} from '@ionic/vue';

import { useAuth } from '../composables/useAuth';

const ionRouter = useIonRouter();
const { user, profile, loading, isAuthenticated, logout } = useAuth();

const naviguer = (chemin: string) => {
  ionRouter.push(chemin);
};

const deconnecter = async () => {
  try {
    await logout();
    ionRouter.push('/connexion');
  } catch {
    // Le message d'erreur est affiché par le store via authStore.error.
  }
};
</script>

<style scoped>
.accueil {
  max-width: 560px;
  margin: 0 auto;
  padding-top: 12vh;
  text-align: center;
}

.accueil h1 {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
}

.accueil p {
  color: var(--ion-color-medium);
}

.chargement,
.actions {
  margin-top: 2rem;
}

.chargement {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.bienvenue {
  font-weight: bold;
  color: var(--ion-text-color);
}
</style>
