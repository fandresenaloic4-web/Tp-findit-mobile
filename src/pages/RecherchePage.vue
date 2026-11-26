<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" @click="retourPublications">Retour</ion-button>
        </ion-buttons>
        <ion-title>Recherche</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <champ-recherche
        :model-value="filtres.texte"
        @update:model-value="majFiltres({ texte: $event })"
      />

      <filtre-publication
        :filtres="filtres"
        :categories="categories"
        :villes="villes"
        @maj="majFiltres"
        @reinitialiser="reinitialiser"
      />

      <h2 v-if="!chargement && !erreur">{{ nombreResultats }} résultat(s)</h2>
      <ion-note color="medium"
        >Recherche sur les {{ LIMITES.recherche }} publications les plus récentes.</ion-note
      >

      <div v-if="chargement" class="ion-text-center"><ion-spinner /></div>
      <ion-note v-else-if="erreurReferentiels || erreur" color="danger">
        {{ erreur || erreurReferentiels }}
      </ion-note>

      <div v-else-if="!nombreResultats" class="ion-text-center">
        <p>Aucun résultat trouvé.</p>
        <ion-button fill="outline" size="small" @click="reinitialiser">
          Réinitialiser les filtres
        </ion-button>
      </div>

      <template v-else>
        <publication-card
          v-for="publication in resultats"
          :key="publication.id"
          :publication="publication"
          :categorie="libelleCategorie(publication.categorieId)"
          :ville="libelleVille(publication.villeId)"
          @ouvrir="ouvrir"
        />
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonNote,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
  useIonRouter,
} from '@ionic/vue';
import ChampRecherche from '@/components/ChampRecherche.vue';
import FiltrePublication from '@/components/FiltrePublication.vue';
import PublicationCard from '@/components/PublicationCard.vue';
import { usePublications, useReferentiels } from '@/composables/usePublications';
import { LIMITES } from '@/utils/constantes';

const ionRouter = useIonRouter();
const {
  categories,
  villes,
  chargerReferentiels,
  erreurReferentiels,
  libelleCategorie,
  libelleVille,
} = useReferentiels();
const { filtres, resultats, chargement, erreur, charger, majFiltres, reinitialiser } =
  usePublications();

const rechercheInitialisee = ref(false);
const nombreResultats = computed(() => resultats.value.length);

function ouvrir(id: string): void {
  ionRouter.push(`/publication/${id}`);
}

function retourPublications(): void {
  ionRouter.push('/publications');
}

// Les filtres Firestore (catégorie, ville, statut) nécessitent une nouvelle requête.
watch(
  () => [filtres.categorieId, filtres.villeId, filtres.statut],
  () => {
    if (rechercheInitialisee.value) void charger();
  },
);

onIonViewWillEnter(async () => {
  await chargerReferentiels();
  rechercheInitialisee.value = true;
  await charger();
});
</script>
