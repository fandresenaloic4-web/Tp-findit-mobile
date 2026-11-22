<template>
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>FindIt</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <IonSearchbar v-model="search" placeholder="Rechercher un objet" />
      <IonSegment v-model="filter" class="ion-margin-bottom">
        <IonSegmentButton value="all"><IonLabel>Tous</IonLabel></IonSegmentButton>
        <IonSegmentButton value="lost"><IonLabel>Perdus</IonLabel></IonSegmentButton>
        <IonSegmentButton value="found"><IonLabel>Trouvés</IonLabel></IonSegmentButton>
      </IonSegment>

      <div v-if="!firebaseEnabled" class="demo-note">
        Mode démonstration — configurez Firebase pour publier et synchroniser.
      </div>

      <IonCard v-for="item in filteredItems" :key="item.id" button @click="openItem(item.id)">
        <div v-if="item.photoUrl" class="card-photo" :style="{ backgroundImage: `url(${item.photoUrl})` }" />
        <IonCardHeader>
          <IonCardSubtitle>{{ item.category }} · {{ item.location }}</IonCardSubtitle>
          <IonCardTitle>{{ item.title }}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {{ item.description }}
          <IonBadge :color="item.status === 'lost' ? 'danger' : item.status === 'found' ? 'success' : 'medium'">
            {{ statusLabel(item.status) }}
          </IonBadge>
        </IonCardContent>
      </IonCard>

      <div v-if="filteredItems.length === 0" class="empty-state">
        Aucun objet ne correspond à votre recherche.
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonContent, IonHeader, IonLabel, IonPage, IonSearchbar, IonSegment,
  IonSegmentButton, IonTitle, IonToolbar,
} from '@ionic/vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { demoItems } from '../data'
import { firebaseEnabled } from '../firebase'
import { subscribeItems } from '../services/items'
import type { FindItItem, ItemStatus } from '../types'
import { filterItems } from '../utils'

const router = useRouter()
const search = ref('')
const filter = ref<'all' | ItemStatus>('all')
const items = ref<FindItItem[]>(demoItems)
let unsubscribe: () => void = () => undefined

onMounted(() => {
  if (firebaseEnabled) unsubscribe = subscribeItems((remoteItems) => { items.value = remoteItems })
})
onUnmounted(() => unsubscribe())

const filteredItems = computed(() => {
  return filterItems(items.value, search.value, filter.value)
})

function statusLabel(status: ItemStatus) {
  return status === 'lost' ? 'Perdu' : status === 'found' ? 'Trouvé' : 'Retrouvé'
}

function openItem(id: string) {
  router.push(`/item/${id}`)
}
</script>
