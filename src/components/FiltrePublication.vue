<script setup lang="ts">
import { IonButton, IonInput, IonItem, IonSelect, IonSelectOption } from '@ionic/vue';
import type { Filtres } from '@/composables/usePublications';
import type { Categorie } from '@/models/categorie.model';
import type { Ville } from '@/models/ville.model';
import { estStatutType } from '@/models/statut.model';
import { getStatuts } from '@/services/statutService';

defineProps<{ filtres: Filtres; categories: Categorie[]; villes: Ville[] }>();
const emit = defineEmits<{
  maj: [patch: Partial<Filtres>];
  reinitialiser: [];
}>();

const statuts = getStatuts();

function detailValeur(evenement: Event): string {
  return (evenement as CustomEvent<{ value: string | null }>).detail.value ?? '';
}

function surCategorie(evenement: Event): void {
  emit('maj', { categorieId: detailValeur(evenement) });
}

function surVille(evenement: Event): void {
  emit('maj', { villeId: detailValeur(evenement) });
}

function surStatut(evenement: Event): void {
  const valeur = detailValeur(evenement);
  emit('maj', { statut: estStatutType(valeur) ? valeur : '' });
}

function surDate(champ: 'dateDebut' | 'dateFin', evenement: Event): void {
  emit('maj', { [champ]: detailValeur(evenement) });
}
</script>

<template>
  <div>
    <ion-item>
      <ion-select label="Catégorie" :value="filtres.categorieId" @ionChange="surCategorie">
        <ion-select-option value="">Toutes</ion-select-option>
        <ion-select-option
          v-for="categorie in categories"
          :key="categorie.id"
          :value="categorie.id"
        >
          {{ categorie.libelle }}
        </ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item>
      <ion-select label="Ville" :value="filtres.villeId" @ionChange="surVille">
        <ion-select-option value="">Toutes</ion-select-option>
        <ion-select-option v-for="ville in villes" :key="ville.id" :value="ville.id">
          {{ ville.libelle }}
        </ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item>
      <ion-select label="Statut" :value="filtres.statut" @ionChange="surStatut">
        <ion-select-option value="">Tous</ion-select-option>
        <ion-select-option v-for="statut in statuts" :key="statut.code" :value="statut.code">
          {{ statut.libelle }}
        </ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item>
      <ion-input
        label="Publié du"
        type="date"
        :value="filtres.dateDebut"
        @ionInput="surDate('dateDebut', $event)"
      />
    </ion-item>

    <ion-item>
      <ion-input
        label="au"
        type="date"
        :value="filtres.dateFin"
        @ionInput="surDate('dateFin', $event)"
      />
    </ion-item>

    <ion-button fill="clear" size="small" @click="emit('reinitialiser')">
      Réinitialiser les filtres
    </ion-button>
  </div>
</template>
