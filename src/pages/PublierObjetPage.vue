<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/" /></ion-buttons>
        <ion-title>{{ idEdition ? 'Modifier la publication' : 'Publier un objet' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-note v-if="erreurReferentiels" color="danger">{{ erreurReferentiels }}</ion-note>

      <form class="formulaire" @submit.prevent="soumettre">
        <ion-item>
          <ion-input
            v-model="form.objet"
            label="Objet *"
            label-placement="floating"
            placeholder="Ex : Portefeuille noir"
          />
        </ion-item>
        <ion-note v-if="tenteEnvoi && erreurs.objet" color="danger">{{ erreurs.objet }}</ion-note>

        <ion-item>
          <ion-textarea
            v-model="form.description"
            label="Description"
            label-placement="floating"
            :rows="3"
          />
        </ion-item>

        <ion-item>
          <ion-select v-model="form.categorieId" label="Catégorie *" label-placement="floating">
            <ion-select-option
              v-for="categorie in categories"
              :key="categorie.id"
              :value="categorie.id"
            >
              {{ categorie.libelle }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-note v-if="tenteEnvoi && erreurs.categorieId" color="danger">
          {{ erreurs.categorieId }}
        </ion-note>

        <ion-item>
          <ion-select v-model="form.villeId" label="Ville *" label-placement="floating">
            <ion-select-option v-for="ville in villes" :key="ville.id" :value="ville.id">
              {{ ville.libelle }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-note v-if="tenteEnvoi && erreurs.villeId" color="danger">{{
          erreurs.villeId
        }}</ion-note>

        <ion-item>
          <ion-input
            v-model="form.localisation"
            label="Lieu précis *"
            label-placement="floating"
            placeholder="Ex : Arrêt de bus d'Andoharanofotsy"
          />
        </ion-item>
        <ion-note v-if="tenteEnvoi && erreurs.localisation" color="danger">
          {{ erreurs.localisation }}
        </ion-note>

        <ion-item>
          <ion-input
            v-model="form.dateTrouve"
            type="date"
            label="Date de perte ou de découverte *"
            label-placement="floating"
            :max="aujourdhui"
          />
        </ion-item>
        <ion-note v-if="tenteEnvoi && erreurs.dateTrouve" color="danger">
          {{ erreurs.dateTrouve }}
        </ion-note>

        <ion-item v-if="idEdition">
          <ion-input
            :value="datePublication"
            type="date"
            label="Date de publication"
            label-placement="floating"
            readonly
          />
        </ion-item>

        <ion-item v-if="!idEdition">
          <ion-select v-model="form.statut" label="Statut *" label-placement="floating">
            <ion-select-option v-for="statut in statuts" :key="statut.code" :value="statut.code">
              {{ statut.libelle }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-button type="submit" expand="block" class="ion-margin-top" :disabled="enCours">
          {{ idEdition ? 'Enregistrer' : 'Publier' }}
        </ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
  useIonRouter,
} from '@ionic/vue';
import { useAuth } from '@/composables/useAuth';
import { useReferentiels } from '@/composables/usePublications';
import type { StatutType } from '@/models/statut.model';
import {
  creerPublicationAvecHistorique,
  getPublication,
  modifierPublication,
} from '@/services/publicationService';
import { getStatuts } from '@/services/statutService';
import { aujourdhuiLocal, dateVersInput, inputVersDate } from '@/utils/date';
import { afficherToastErreur } from '@/utils/notifications';

const route = useRoute();
const ionRouter = useIonRouter();
const { user } = useAuth();
const { categories, villes, erreurReferentiels, chargerReferentiels } = useReferentiels();
const statuts = getStatuts();

const idEdition = computed(() => {
  const valeur = route.params.id;
  return typeof valeur === 'string' && valeur ? valeur : null;
});
const aujourdhui = ref(aujourdhuiLocal());
const datePublication = ref('');

const form = reactive({
  objet: '',
  description: '',
  categorieId: '',
  villeId: '',
  localisation: '',
  dateTrouve: aujourdhuiLocal(),
  statut: 'perdu' as StatutType,
});
const tenteEnvoi = ref(false);
const enCours = ref(false);

const erreurs = computed(() => ({
  objet: form.objet.trim() ? '' : "Le titre de l'objet est obligatoire",
  categorieId: form.categorieId ? '' : 'Choisis une catégorie',
  villeId: form.villeId ? '' : 'Choisis une ville',
  localisation: form.localisation.trim() ? '' : 'La localisation est obligatoire',
  dateTrouve: form.dateTrouve ? '' : 'La date est obligatoire',
}));
const valide = computed(() => Object.values(erreurs.value).every((message) => !message));

onIonViewWillEnter(async () => {
  tenteEnvoi.value = false;
  aujourdhui.value = aujourdhuiLocal();
  await chargerReferentiels();

  if (!idEdition.value) {
    Object.assign(form, {
      objet: '',
      description: '',
      categorieId: '',
      villeId: '',
      localisation: '',
      dateTrouve: aujourdhui.value,
      statut: 'perdu' as StatutType,
    });
    return;
  }

  const publication = await getPublication(idEdition.value);
  if (!publication || publication.auteurId !== user.value?.uid) {
    ionRouter.replace('/accueil');
    return;
  }

  Object.assign(form, {
    objet: publication.objet,
    description: publication.description,
    categorieId: publication.categorieId,
    villeId: publication.villeId,
    localisation: publication.localisation,
    dateTrouve: dateVersInput(publication.dateTrouve),
  });
  datePublication.value = dateVersInput(publication.datePublication);
});

async function soumettre(): Promise<void> {
  tenteEnvoi.value = true;
  if (!valide.value || !user.value) return;

  enCours.value = true;
  try {
    const donnees = {
      objet: form.objet.trim(),
      description: form.description.trim(),
      categorieId: form.categorieId,
      villeId: form.villeId,
      localisation: form.localisation.trim(),
      dateTrouve: inputVersDate(form.dateTrouve),
    };

    let id: string;
    if (idEdition.value) {
      id = idEdition.value;
      await modifierPublication(id, donnees);
    } else {
      // Le statut et son premier mouvement sont écrits dans le même batch Firestore.
      id = await creerPublicationAvecHistorique(user.value.uid, donnees, form.statut);
    }

    ionRouter.replace(`/publication/${id}`);
  } catch (e) {
    console.error(e);
    await afficherToastErreur("Erreur lors de l'enregistrement");
  } finally {
    enCours.value = false;
  }
}
</script>

<style scoped>
.formulaire {
  max-width: 720px;
  margin: 0 auto;
}
</style>
