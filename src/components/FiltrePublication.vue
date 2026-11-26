<script setup lang="ts">
import { IonButton, IonInput, IonItem, IonSelect, IonSelectOption } from '@ionic/vue';
import type { Filtres } from '@/composables/usePublications';
import type { Categorie } from '@/models/categorie.model';
import type { Ville } from '@/models/ville.model';
import { getStatuts } from '@/services/statutService';

defineProps<{ filtres: Filtres; categories: Categorie[]; villes: Ville[] }>();
const emit = defineEmits<{ (e: 'maj', patch: Partial<Filtres>): void; (e: 'reinitialiser'): void }>();
const statuts = getStatuts();
</script>

<template>
  <div>
    <ion-item>
      <ion-select label="Catégorie" :value="filtres.categorieId" @ionChange="emit('maj', { categorieId: $event.detail.value })">
        <ion-select-option value="">Toutes</ion-select-option>
        <ion-select-option v-for="c in categories" :key="c.id" :value="c.id">{{ c.libelle }}</ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-select label="Ville" :value="filtres.villeId" @ionChange="emit('maj', { villeId: $event.detail.value })">
        <ion-select-option value="">Toutes</ion-select-option>
        <ion-select-option v-for="v in villes" :key="v.id" :value="v.id">{{ v.libelle }}</ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-select label="Statut" :value="filtres.statut" @ionChange="emit('maj', { statut: $event.detail.value })">
        <ion-select-option value="">Tous</ion-select-option>
        <ion-select-option v-for="s in statuts" :key="s.code" :value="s.code">{{ s.libelle }}</ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-input label="Publié du" type="date" :value="filtres.dateDebut" @ionInput="emit('maj', { dateDebut: String($event.detail.value ?? '') })" />
    </ion-item>
    <ion-item>
      <ion-input label="au" type="date" :value="filtres.dateFin" @ionInput="emit('maj', { dateFin: String($event.detail.value ?? '') })" />
    </ion-item>
    <ion-button fill="clear" size="small" @click="emit('reinitialiser')">Réinitialiser les filtres</ion-button>
  </div>
</template>
