<!--<template>-->
<!--  <ion-page>-->
<!--    <ion-content class="ion-padding">-->
<!--      <h1>Detail Publication</h1>-->
<!--      <p>Page en cours de développement.</p>-->
<!--    </ion-content>-->
<!--  </ion-page>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { IonPage, IonContent } from '@ionic/vue';-->
<!--</script>-->
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader,
  IonPage, IonSelect, IonSelectOption, IonSpinner, IonTitle, IonToolbar, alertController, onIonViewWillEnter,
} from '@ionic/vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config/config';
import { useAuth } from '@/composables/useAuth';
import { useReferentiels } from '@/composables/usePublications';
import { getPublication, supprimerPublication } from '@/services/publicationService';
import { changerStatut, getHistoriqueStatuts, getStatuts, libelleStatut } from '@/services/statutService';
import type { Publication } from '@/models/publication.model';
import type { MouvementStatut, StatutType } from '@/models/statut.model';
import BadgeStatut from '@/components/BadgeStatut.vue';

interface Auteur { nom: string; email: string; telephone: string }

const route = useRoute();
const router = useRouter();
const { user } = useAuth();
const { chargerReferentiels, libelleCategorie, libelleVille } = useReferentiels();
const statuts = getStatuts();

const publication = ref<Publication | null>(null);
const historique = ref<MouvementStatut[]>([]);
const auteur = ref<Auteur | null>(null);
const chargement = ref(true);
const introuvable = ref(false);

const id = computed(() => route.params.id as string);
const estAuteur = computed(() => !!user.value && user.value.uid === publication.value?.auteurId);

async function charger() {
  chargement.value = true;
  await chargerReferentiels();
  publication.value = await getPublication(id.value);
  introuvable.value = !publication.value;
  if (publication.value) {
    historique.value = await getHistoriqueStatuts(id.value);
    // À remplacer par utilisateurService.getUtilisateur() de Miranto quand il sera prêt
    const snap = await getDoc(doc(db, 'utilisateurs', publication.value.auteurId));
    auteur.value = snap.exists() ? (snap.data() as Auteur) : null;
  }
  chargement.value = false;
}
onIonViewWillEnter(charger);

async function surChangementStatut(nouveau: StatutType) {
  if (!estAuteur.value || !publication.value || nouveau === publication.value.statut) return;
  await changerStatut(id.value, nouveau);
  await charger();
}

async function confirmerSuppression() {
  const alerte = await alertController.create({
    header: 'Supprimer la publication ?',
    message: 'Cette action est définitive.',
    buttons: [
      { text: 'Annuler', role: 'cancel' },
      { text: 'Supprimer', role: 'destructive', handler: async () => { await supprimerPublication(id.value); router.replace('/'); } },
    ],
  });
  await alerte.present();
}

function contacter() {
  // Route de la messagerie (Miranto) : à adapter à son nom de route
  router.push({ path: '/conversation/nouvelle', query: { publicationId: id.value, auteurId: publication.value!.auteurId } });
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/" /></ion-buttons>
        <ion-title>Détail</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="chargement" class="ion-text-center ion-padding"><ion-spinner /></div>
      <p v-else-if="introuvable" class="ion-padding">Cette publication n'existe plus.</p>

      <template v-else-if="publication">
        <div v-if="publication.photoUrls.length" style="display: flex; overflow-x: auto; gap: 8px">
          <img v-for="u in publication.photoUrls" :key="u" :src="u" :alt="publication.objet" style="height: 220px; flex: none" />
        </div>

        <div class="ion-padding">
          <h2>{{ publication.objet }} <badge-statut :statut="publication.statut" /></h2>
          <p>{{ publication.description || 'Aucune description.' }}</p>
          <p><strong>Catégorie :</strong> {{ libelleCategorie(publication.categorieId) }}</p>
          <p><strong>Ville :</strong> {{ libelleVille(publication.villeId) }}</p>
          <p><strong>Lieu :</strong> {{ publication.localisation }}</p>
          <p><strong>Date de perte / découverte :</strong> {{ publication.dateTrouve.toLocaleDateString('fr-FR') }}</p>
          <p><strong>Publié le :</strong> {{ publication.datePublication.toLocaleDateString('fr-FR') }}</p>
          <p v-if="auteur"><strong>Publié par :</strong> {{ auteur.nom }}</p>

          <ion-button v-if="!estAuteur" expand="block" @click="contacter">Contacter l'auteur</ion-button>
          <template v-else>
            <ion-item>
              <ion-select label="Changer le statut" :value="publication.statut" @ionChange="surChangementStatut($event.detail.value)">
                <ion-select-option v-for="s in statuts" :key="s.code" :value="s.code">{{ s.libelle }}</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-button expand="block" fill="outline" @click="router.push(`/publier/${id}`)">Modifier</ion-button>
            <ion-button expand="block" color="danger" fill="outline" @click="confirmerSuppression">Supprimer</ion-button>
          </template>
        </div>

        <ion-list>
          <ion-list-header>Historique des statuts</ion-list-header>
          <ion-item v-if="!historique.length"><ion-label>Aucun changement enregistré.</ion-label></ion-item>
          <ion-item v-for="m in historique" :key="m.id">
            <ion-label>
              {{ libelleStatut(m.statut) }}
              <p>{{ m.dateChangement.toLocaleString('fr-FR') }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </template>
    </ion-content>
  </ion-page>
</template>
