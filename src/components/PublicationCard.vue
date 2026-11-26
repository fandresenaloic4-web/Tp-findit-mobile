<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
import type { Publication } from '@/models/publication.model';
import { formaterDate } from '@/utils/date';
import BadgeStatut from './BadgeStatut.vue';

defineProps<{ publication: Publication; categorie: string; ville: string }>();
const emit = defineEmits<{
  ouvrir: [id: string];
}>();
</script>

<template>
  <ion-card button @click="emit('ouvrir', publication.id)">
    <img
      v-if="publication.photoUrls.length"
      class="publication-card__image"
      :src="publication.photoUrls[0]"
      :alt="publication.objet"
    />
    <div v-else class="publication-card__image publication-card__image--vide">Pas de photo</div>

    <ion-card-header>
      <ion-card-subtitle>{{ categorie }} · {{ ville }}</ion-card-subtitle>
      <ion-card-title>{{ publication.objet }}</ion-card-title>
    </ion-card-header>

    <ion-card-content class="publication-card__pied">
      <span>{{ formaterDate(publication.datePublication) }}</span>
      <badge-statut :statut="publication.statut" />
    </ion-card-content>
  </ion-card>
</template>

<style scoped>
.publication-card__image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.publication-card__image--vide {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ion-color-light);
  color: var(--ion-color-medium);
}

.publication-card__pied {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
