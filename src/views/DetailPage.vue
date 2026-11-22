<template>
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start"><IonBackButton default-href="/home" /></IonButtons>
        <IonTitle>Détail</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent v-if="item" class="ion-padding">
      <div v-if="item.photoUrl" class="detail-photo" :style="{ backgroundImage: `url(${item.photoUrl})` }" />
      <IonChip :color="item.status === 'lost' ? 'danger' : item.status === 'found' ? 'success' : 'medium'">
        {{ statusLabel(item.status) }}
      </IonChip>
      <h1>{{ item.title }}</h1>
      <p class="muted">{{ item.category }} · {{ item.location }}</p>
      <p>{{ item.description }}</p>
      <IonItem lines="none"><IonLabel><b>Publié par</b><p>{{ item.ownerName }}</p></IonLabel></IonItem>

      <div v-if="isOwner" class="ion-margin-top">
        <p><b>Changer le statut</b></p>
        <IonSegment :value="item.status" @ionChange="changeStatus($event.detail.value as ItemStatus)">
          <IonSegmentButton value="lost"><IonLabel>Perdu</IonLabel></IonSegmentButton>
          <IonSegmentButton value="found"><IonLabel>Trouvé</IonLabel></IonSegmentButton>
          <IonSegmentButton value="resolved"><IonLabel>Retrouvé</IonLabel></IonSegmentButton>
        </IonSegment>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonBackButton, IonButtons, IonChip, IonContent, IonHeader, IonItem, IonLabel,
  IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, toastController,
} from '@ionic/vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { demoItems } from '../data'
import { auth, firebaseEnabled } from '../firebase'
import { getItem, updateItemStatus } from '../services/items'
import type { FindItItem, ItemStatus } from '../types'

const route = useRoute()
const item = ref<FindItItem | null>(null)
const isOwner = computed(() => Boolean(auth?.currentUser && item.value?.ownerId === auth?.currentUser?.uid))

onMounted(async () => {
  const id = String(route.params.id)
  item.value = demoItems.find((demo) => demo.id === id) || null
  if (firebaseEnabled) item.value = await getItem(id) || item.value
})

function statusLabel(status: ItemStatus) {
  return status === 'lost' ? 'Perdu' : status === 'found' ? 'Trouvé' : 'Retrouvé'
}

async function changeStatus(status: ItemStatus) {
  if (!item.value) return
  await updateItemStatus(item.value.id, status)
  item.value.status = status
  const toast = await toastController.create({ message: 'Statut mis à jour.', duration: 2000, color: 'success' })
  await toast.present()
}
</script>
