<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/publications" /></ion-buttons>
        <ion-title>Contacter l'auteur</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="chargement" class="ion-text-center"><ion-spinner /></div>

      <template v-else-if="auteur">
        <h2>{{ auteur.nom }}</h2>
        <p v-if="objet">
          À propos de l'objet : <strong>{{ objet }}</strong>
        </p>

        <ion-list>
          <ion-item>
            <ion-label>
              <h3>E-mail</h3>
              <p>{{ auteur.email }}</p>
            </ion-label>
          </ion-item>
          <ion-item v-if="auteur.telephone">
            <ion-label>
              <h3>Téléphone</h3>
              <p>{{ auteur.telephone }}</p>
            </ion-label>
          </ion-item>
        </ion-list>

        <ion-button expand="block" :disabled="!auteur.email" @click="envoyerEmail">
          Envoyer un e-mail
        </ion-button>
        <ion-button expand="block" fill="outline" :disabled="!auteur.telephone" @click="appeler">
          Appeler
        </ion-button>
      </template>

      <ion-note v-else color="medium">
        {{ erreur || 'Les informations de contact ne sont pas disponibles.' }}
      </ion-note>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
} from '@ionic/vue';
import { getUserProfile, type UserProfile } from '@/services/authService';
import { getPublication } from '@/services/publicationService';

const route = useRoute();
const id = computed(() => {
  const valeur = route.params.id;
  return typeof valeur === 'string' ? valeur : '';
});

const auteur = ref<UserProfile | null>(null);
const chargement = ref(true);
const erreur = ref('');
const objet = ref('');

async function charger(): Promise<void> {
  chargement.value = true;
  erreur.value = '';

  try {
    const publication = id.value ? await getPublication(id.value) : null;
    objet.value = publication?.objet ?? '';
    auteur.value = publication ? await getUserProfile(publication.auteurId) : null;
  } catch (e) {
    console.error(e);
    auteur.value = null;
    erreur.value = 'Impossible de charger les informations de contact.';
  } finally {
    chargement.value = false;
  }
}

function envoyerEmail(): void {
  if (auteur.value?.email) window.location.href = `mailto:${auteur.value.email}`;
}

function appeler(): void {
  if (auteur.value?.telephone) window.location.href = `tel:${auteur.value.telephone}`;
}

onIonViewWillEnter(charger);
</script>
