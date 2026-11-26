<!--<template>-->
<!--  <ion-page>-->
<!--    <ion-content class="ion-padding">-->
<!--      <h1>Publier Objet</h1>-->
<!--      <p>Page en cours de développement.</p>-->
<!--    </ion-content>-->
<!--  </ion-page>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { IonPage, IonContent } from '@ionic/vue';-->
<!--</script>-->
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonNote, IonPage,
  IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar, onIonViewWillEnter, toastController,
} from '@ionic/vue';
import { useAuth } from '@/composables/useAuth';
import { useReferentiels } from '@/composables/usePublications';
import { creerPublication, getPublication, modifierPublication } from '@/services/publicationService';
import { changerStatut, getStatuts } from '@/services/statutService';
import type { StatutType } from '@/models/statut.model';

const route = useRoute();
const router = useRouter();
const { user } = useAuth(); // user : ref du User Firebase (uid)
const { categories, villes, chargerReferentiels } = useReferentiels();
const statuts = getStatuts();

const idEdition = computed(() => (route.params.id as string | undefined) ?? null);
const aujourdhui = new Date().toISOString().slice(0, 10);

const form = reactive({
  objet: '', description: '', categorieId: '', villeId: '', localisation: '',
  dateTrouve: aujourdhui, statut: 'perdu' as StatutType,
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
const valide = computed(() => Object.values(erreurs.value).every((e) => !e));

onIonViewWillEnter(async () => {
  await chargerReferentiels();
  if (!idEdition.value) return;
  const p = await getPublication(idEdition.value);
  if (!p || p.auteurId !== user.value?.uid) return router.replace('/');
  Object.assign(form, {
    objet: p.objet, description: p.description, categorieId: p.categorieId, villeId: p.villeId,
    localisation: p.localisation, dateTrouve: p.dateTrouve.toISOString().slice(0, 10), statut: p.statut,
  });
});

async function soumettre() {
  tenteEnvoi.value = true;
  if (!valide.value || !user.value) return;
  enCours.value = true;
  try {
    const donnees = {
      objet: form.objet.trim(), description: form.description.trim(),
      categorieId: form.categorieId, villeId: form.villeId, localisation: form.localisation.trim(),
      dateTrouve: new Date(form.dateTrouve),
    };
    let id: string;
    if (idEdition.value) {
      await modifierPublication(idEdition.value, donnees);
      id = idEdition.value;
    } else {
      id = await creerPublication(user.value.uid, { ...donnees, statut: form.statut, photoUrls: [] });
      await changerStatut(id, form.statut); // premier mouvement de l'historique
    }
    router.replace(`/publication/${id}`);
  } catch (e) {
    console.error(e);
    (await toastController.create({ message: "Erreur lors de l'enregistrement", duration: 2500, color: 'danger' })).present();
  } finally {
    enCours.value = false;
  }
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/" /></ion-buttons>
        <ion-title>{{ idEdition ? 'Modifier la publication' : 'Publier un objet' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-input v-model="form.objet" label="Objet *" label-placement="floating" placeholder="Ex : Portefeuille noir" />
      </ion-item>
      <ion-note v-if="tenteEnvoi && erreurs.objet" color="danger">{{ erreurs.objet }}</ion-note>

      <ion-item>
        <ion-textarea v-model="form.description" label="Description" label-placement="floating" :rows="3" />
      </ion-item>

      <ion-item>
        <ion-select v-model="form.categorieId" label="Catégorie *" label-placement="floating">
          <ion-select-option v-for="c in categories" :key="c.id" :value="c.id">{{ c.libelle }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-note v-if="tenteEnvoi && erreurs.categorieId" color="danger">{{ erreurs.categorieId }}</ion-note>

      <ion-item>
        <ion-select v-model="form.villeId" label="Ville *" label-placement="floating">
          <ion-select-option v-for="v in villes" :key="v.id" :value="v.id">{{ v.libelle }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-note v-if="tenteEnvoi && erreurs.villeId" color="danger">{{ erreurs.villeId }}</ion-note>

      <ion-item>
        <ion-input v-model="form.localisation" label="Lieu précis *" label-placement="floating" placeholder="Ex : Arrêt de bus d'Andoharanofotsy" />
      </ion-item>
      <ion-note v-if="tenteEnvoi && erreurs.localisation" color="danger">{{ erreurs.localisation }}</ion-note>

      <ion-item>
        <ion-input v-model="form.dateTrouve" type="date" label="Date de perte ou de découverte *" label-placement="floating" :max="aujourdhui" />
      </ion-item>
      <ion-note v-if="tenteEnvoi && erreurs.dateTrouve" color="danger">{{ erreurs.dateTrouve }}</ion-note>

      <ion-item>
        <ion-input :value="new Date().toLocaleDateString('fr-FR')" label="Date de publication" label-placement="floating" readonly />
      </ion-item>

      <ion-item v-if="!idEdition">
        <ion-select v-model="form.statut" label="Statut *" label-placement="floating">
          <ion-select-option v-for="s in statuts" :key="s.code" :value="s.code">{{ s.libelle }}</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-button expand="block" class="ion-margin-top" :disabled="enCours" @click="soumettre">
        {{ idEdition ? 'Enregistrer' : 'Publier' }}
      </ion-button>
    </ion-content>
  </ion-page>
</template>
