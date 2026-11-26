<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Publications</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="allerRecherche">Rechercher</ion-button>
          <ion-button fill="clear" @click="allerPublier">Publier</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="chargement" class="ion-text-center"><ion-spinner /></div>

      <template v-else>
        <ion-note v-if="erreurReferentiels || erreur" color="danger">
          {{ erreur || erreurReferentiels }}
        </ion-note>

        <div v-else-if="!publications.length" class="ion-text-center">
          <p>Aucune publication pour le moment.</p>
          <ion-button @click="allerPublier">Publier un objet</ion-button>
        </div>

        <template v-else>
          <h2>Publications récentes</h2>
          <publication-card
            v-for="publication in publications"
            :key="publication.id"
            :publication="publication"
            :categorie="libelleCategorie(publication.categorieId)"
            :ville="libelleVille(publication.villeId)"
            @ouvrir="ouvrir"
          />
        </template>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
import PublicationCard from '@/components/PublicationCard.vue';
import { useReferentiels } from '@/composables/usePublications';
import type { Publication } from '@/models/publication.model';
import { getPublicationsRecentes } from '@/services/publicationService';
import { LIMITES } from '@/utils/constantes';

const ionRouter = useIonRouter();
const { chargerReferentiels, erreurReferentiels, libelleCategorie, libelleVille } =
  useReferentiels();

const publications = ref<Publication[]>([]);
const chargement = ref(true);
const erreur = ref('');

function ouvrir(id: string): void {
  ionRouter.push(`/publication/${id}`);
}

function allerRecherche(): void {
  ionRouter.push('/recherche');
}

function allerPublier(): void {
  ionRouter.push('/publier');
}

async function charger(): Promise<void> {
  chargement.value = true;
  erreur.value = '';
  try {
    publications.value = await getPublicationsRecentes(LIMITES.listePublications);
  } catch (e) {
    console.error(e);
    erreur.value = 'Impossible de charger les publications.';
  } finally {
    chargement.value = false;
  }
}

onIonViewWillEnter(async () => {
  await chargerReferentiels();
  await charger();
});
</script>
