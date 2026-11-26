<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/publications" /></ion-buttons>
        <ion-title>Détail</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="chargement" class="ion-text-center ion-padding"><ion-spinner /></div>
      <p v-else-if="introuvable" class="ion-padding">Cette publication n'existe plus.</p>
      <ion-note v-else-if="erreur" color="danger" class="ion-padding">{{ erreur }}</ion-note>

      <template v-else-if="publication">
        <div v-if="publication.photoUrls.length" class="detail-photos">
          <img
            v-for="url in publication.photoUrls"
            :key="url"
            :src="url"
            :alt="publication.objet"
          />
        </div>

        <div class="ion-padding">
          <h2>{{ publication.objet }} <badge-statut :statut="publication.statut" /></h2>
          <p>{{ publication.description || 'Aucune description.' }}</p>
          <p><strong>Catégorie :</strong> {{ libelleCategorie(publication.categorieId) }}</p>
          <p><strong>Ville :</strong> {{ libelleVille(publication.villeId) }}</p>
          <p><strong>Lieu :</strong> {{ publication.localisation }}</p>
          <p>
            <strong>Date de perte / découverte :</strong>
            {{ formaterDate(publication.dateTrouve) }}
          </p>
          <p><strong>Publié le :</strong> {{ formaterDate(publication.datePublication) }}</p>

          <template v-if="auteur">
            <p><strong>Publié par :</strong> {{ auteur.nom }}</p>
            <p><strong>E-mail :</strong> {{ auteur.email }}</p>
            <p v-if="auteur.telephone"><strong>Téléphone :</strong> {{ auteur.telephone }}</p>
          </template>

          <ion-button v-if="!estAuteur" expand="block" @click="contacter"
            >Contacter l'auteur</ion-button
          >

          <template v-else>
            <ion-item>
              <ion-select
                label="Changer le statut"
                :value="publication.statut"
                @ionChange="surChangementStatut"
              >
                <ion-select-option
                  v-for="statut in statuts"
                  :key="statut.code"
                  :value="statut.code"
                >
                  {{ statut.libelle }}
                </ion-select-option>
              </ion-select>
            </ion-item>
            <ion-button expand="block" fill="outline" @click="modifier">Modifier</ion-button>
            <ion-button expand="block" color="danger" fill="outline" @click="confirmerSuppression">
              Supprimer
            </ion-button>
          </template>
        </div>

        <ion-list>
          <ion-list-header>Historique des statuts</ion-list-header>
          <ion-item v-if="!historique.length"
            ><ion-label>Aucun changement enregistré.</ion-label></ion-item
          >
          <ion-item v-for="mouvement in historique" :key="mouvement.id">
            <ion-label>
              {{ libelleStatut(mouvement.statut) }}
              <p>{{ formaterDateHeure(mouvement.dateChangement) }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </template>
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
  IonListHeader,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  alertController,
  onIonViewWillEnter,
  useIonRouter,
} from '@ionic/vue';
import BadgeStatut from '@/components/BadgeStatut.vue';
import { useAuth } from '@/composables/useAuth';
import { useReferentiels } from '@/composables/usePublications';
import type { Publication } from '@/models/publication.model';
import type { MouvementStatut } from '@/models/statut.model';
import { estStatutType } from '@/models/statut.model';
import { getUserProfile, type UserProfile } from '@/services/authService';
import { getPublication, supprimerPublication } from '@/services/publicationService';
import {
  changerStatut,
  getHistoriqueStatuts,
  getStatuts,
  libelleStatut,
} from '@/services/statutService';
import { formaterDate, formaterDateHeure } from '@/utils/date';
import { afficherToastErreur } from '@/utils/notifications';

const route = useRoute();
const ionRouter = useIonRouter();
const { user } = useAuth();
const { chargerReferentiels, libelleCategorie, libelleVille } = useReferentiels();
const statuts = getStatuts();

const publication = ref<Publication | null>(null);
const historique = ref<MouvementStatut[]>([]);
const auteur = ref<UserProfile | null>(null);
const chargement = ref(true);
const introuvable = ref(false);
const erreur = ref('');

const id = computed(() => {
  const valeur = route.params.id;
  return typeof valeur === 'string' ? valeur : '';
});
const estAuteur = computed(() => !!user.value && user.value.uid === publication.value?.auteurId);

async function charger(): Promise<void> {
  chargement.value = true;
  erreur.value = '';

  try {
    await chargerReferentiels();
    publication.value = id.value ? await getPublication(id.value) : null;
    introuvable.value = !publication.value;

    if (publication.value) {
      try {
        historique.value = await getHistoriqueStatuts(id.value);
      } catch (e) {
        console.error(e);
        historique.value = [];
      }

      // Le profil peut être illisible pour un visiteur non connecté.
      try {
        auteur.value = await getUserProfile(publication.value.auteurId);
      } catch (e) {
        console.error(e);
        auteur.value = null;
      }
    }
  } catch (e) {
    console.error(e);
    erreur.value = 'Impossible de charger cette publication.';
  } finally {
    chargement.value = false;
  }
}

async function surChangementStatut(evenement: Event): Promise<void> {
  const valeur = (evenement as CustomEvent<{ value: string }>).detail.value;
  if (!estStatutType(valeur) || !estAuteur.value || !publication.value) return;
  if (valeur === publication.value.statut) return;

  try {
    await changerStatut(id.value, valeur);
    await charger();
  } catch (e) {
    console.error(e);
    await afficherToastErreur('Le changement de statut a échoué.');
  }
}

async function confirmerSuppression(): Promise<void> {
  const alerte = await alertController.create({
    header: 'Supprimer la publication ?',
    message: 'Cette action est définitive.',
    buttons: [
      { text: 'Annuler', role: 'cancel' },
      {
        text: 'Supprimer',
        role: 'destructive',
        handler: async () => {
          try {
            await supprimerPublication(id.value);
            ionRouter.replace('/accueil');
          } catch (e) {
            console.error(e);
            await afficherToastErreur('La suppression a échoué.');
          }
        },
      },
    ],
  });
  await alerte.present();
}

function contacter(): void {
  ionRouter.push(`/publication/${id.value}/contact`);
}

function modifier(): void {
  ionRouter.push(`/publier/${id.value}`);
}

onIonViewWillEnter(charger);
</script>

<style scoped>
.detail-photos {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.detail-photos img {
  height: 220px;
  flex: none;
}
</style>
