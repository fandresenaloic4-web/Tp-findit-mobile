<!--<template>-->
<!--  <ion-page>-->
<!--    <ion-content class="ion-padding">-->
<!--      <h1>Accueil</h1>-->
<!--      <p>Page en cours de développement.</p>-->
<!--    </ion-content>-->
<!--  </ion-page>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { IonPage, IonContent } from '@ionic/vue';-->
<!--</script>-->
<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonSpinner, IonTitle, IonToolbar,
  onIonViewWillEnter,
} from '@ionic/vue';
import { add } from 'ionicons/icons';
import { usePublications, useReferentiels } from '@/composables/usePublications';
import PublicationCard from '@/components/PublicationCard.vue';
import ChampRecherche from '@/components/ChampRecherche.vue';
import FiltrePublication from '@/components/FiltrePublication.vue';

const router = useRouter();
const { categories, villes, chargerReferentiels, libelleCategorie, libelleVille } = useReferentiels();
const { resultats, filtres, chargement, erreur, charger, majFiltres, reinitialiser } = usePublications();

onIonViewWillEnter(async () => {
  await chargerReferentiels();
  await charger();
});

// Les filtres gérés par Firestore relancent la requête ; texte et dates sont filtrés localement.
watch(() => [filtres.categorieId, filtres.villeId, filtres.statut], charger);
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar><ion-title>FindIt</ion-title></ion-toolbar>
      <ion-toolbar>
        <champ-recherche :model-value="filtres.texte" @update:model-value="majFiltres({ texte: $event })" />
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <filtre-publication
          :filtres="filtres" :categories="categories" :villes="villes"
          @maj="majFiltres" @reinitialiser="reinitialiser"
      />

      <div v-if="chargement" class="ion-text-center ion-padding"><ion-spinner /></div>
      <p v-else-if="erreur" class="ion-padding">{{ erreur }}</p>
      <p v-else-if="!resultats.length" class="ion-padding ion-text-center">Aucun résultat trouvé.</p>

      <publication-card
          v-for="p in resultats" :key="p.id"
          :publication="p"
          :categorie="libelleCategorie(p.categorieId)"
          :ville="libelleVille(p.villeId)"
          @ouvrir="(id) => router.push(`/publication/${id}`)"
      />

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="router.push('/publier')"><ion-icon :icon="add" /></ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>
