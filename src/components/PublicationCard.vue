<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
import type { Publication } from '@/models/publication.model';
import BadgeStatut from './BadgeStatut.vue';

defineProps<{ publication: Publication; categorie: string; ville: string }>();
defineEmits<{ (e: 'ouvrir', id: string): void }>();
</script>

<template>
  <ion-card button @click="$emit('ouvrir', publication.id)">
    <img
        v-if="publication.photoUrls.length"
        :src="publication.photoUrls[0]"
        :alt="publication.objet"
        style="width: 100%; height: 160px; object-fit: cover"
    />
    <div
        v-else
        style="height: 160px; display: flex; align-items: center; justify-content: center; background: var(--ion-color-light)"
    >
      Pas de photo
    </div>
    <ion-card-header>
      <ion-card-subtitle>{{ categorie }} · {{ ville }}</ion-card-subtitle>
      <ion-card-title>{{ publication.objet }}</ion-card-title>
    </ion-card-header>
    <ion-card-content style="display: flex; justify-content: space-between; align-items: center">
      <span>{{ publication.datePublication.toLocaleDateString('fr-FR') }}</span>
      <badge-statut :statut="publication.statut" />
    </ion-card-content>
  </ion-card>
</template>
