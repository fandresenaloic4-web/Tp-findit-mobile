<template>
  <IonPage>
    <IonHeader><IonToolbar color="primary"><IonTitle>Publier une annonce</IonTitle></IonToolbar></IonHeader>
    <IonContent class="ion-padding">
      <IonList>
        <IonItem><IonInput v-model="title" label="Objet" label-placement="stacked" /></IonItem>
        <IonItem><IonTextarea v-model="description" label="Description" label-placement="stacked" :rows="3" /></IonItem>
        <IonItem>
          <IonSelect v-model="category" label="Catégorie" label-placement="stacked">
            <IonSelectOption value="Clés">Clés</IonSelectOption>
            <IonSelectOption value="Électronique">Électronique</IonSelectOption>
            <IonSelectOption value="Documents">Documents</IonSelectOption>
            <IonSelectOption value="Vêtements">Vêtements</IonSelectOption>
            <IonSelectOption value="Autre">Autre</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem><IonInput v-model="location" label="Lieu" label-placement="stacked" /></IonItem>
        <IonItem>
          <IonSelect v-model="status" label="Statut" label-placement="stacked">
            <IonSelectOption value="lost">Perdu</IonSelectOption>
            <IonSelectOption value="found">Trouvé</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonList>

      <div v-if="photoPreview" class="photo-preview" :style="{ backgroundImage: `url(${photoPreview})` }" />
      <IonButton expand="block" fill="outline" @click="takePhoto">
        <IonIcon slot="start" :icon="cameraOutline" />Ajouter une photo
      </IonButton>
      <IonButton expand="block" class="ion-margin-top" :disabled="publishing" @click="publish">
        {{ publishing ? 'Publication…' : 'Publier l’annonce' }}
      </IonButton>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList,
  IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar,
  toastController,
} from '@ionic/vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { cameraOutline } from 'ionicons/icons'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { createItem, uploadPhoto } from '../services/items'
import type { ItemStatus } from '../types'

const router = useRouter()
const title = ref('')
const description = ref('')
const category = ref('Autre')
const location = ref('')
const status = ref<ItemStatus>('lost')
const publishing = ref(false)
const photoPreview = ref('')
let photoBlob: Blob | null = null

async function takePhoto() {
  try {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    })
    photoPreview.value = image.dataUrl || ''
    if (image.dataUrl) photoBlob = await (await fetch(image.dataUrl)).blob()
  } catch {
    // The native action sheet can be dismissed without an error being actionable.
  }
}

async function publish() {
  if (!title.value.trim() || !description.value.trim() || !location.value.trim()) {
    const toast = await toastController.create({ message: 'Complétez tous les champs.', duration: 2500, color: 'warning' })
    await toast.present()
    return
  }
  if (!auth?.currentUser) {
    const toast = await toastController.create({ message: 'Connectez-vous avant de publier.', duration: 2500, color: 'warning' })
    await toast.present()
    router.push('/profile')
    return
  }
  publishing.value = true
  try {
    let photoUrl: string | undefined
    if (photoBlob) photoUrl = await uploadPhoto(photoBlob, auth.currentUser.uid)
    await createItem({
      title: title.value.trim(),
      description: description.value.trim(),
      category: category.value,
      location: location.value.trim(),
      status: status.value,
      photoUrl,
    })
    const toast = await toastController.create({ message: 'Annonce publiée.', duration: 2000, color: 'success' })
    await toast.present()
    router.push('/home')
  } catch (error) {
    const toast = await toastController.create({ message: String(error), duration: 3000, color: 'danger' })
    await toast.present()
  } finally {
    publishing.value = false
  }
}
</script>
