<template>
  <IonPage>
    <IonHeader><IonToolbar color="primary"><IonTitle>Profil</IonTitle></IonToolbar></IonHeader>
    <IonContent class="ion-padding">
      <div v-if="!firebaseEnabled" class="demo-note">
        Configurez Firebase dans le fichier <code>.env</code> pour activer les comptes.
      </div>

      <template v-if="user">
        <div class="profile-header">
          <IonAvatar><IonIcon :icon="personCircle" /></IonAvatar>
          <h2>{{ user.displayName || user.email }}</h2>
          <p>{{ user.email }}</p>
        </div>
        <h3>Mes annonces</h3>
        <IonCard v-for="item in myItems" :key="item.id" button @click="$router.push(`/item/${item.id}`)">
          <IonCardHeader>
            <IonCardSubtitle>{{ item.category }}</IonCardSubtitle>
            <IonCardTitle>{{ item.title }}</IonCardTitle>
          </IonCardHeader>
        </IonCard>
        <p v-if="myItems.length === 0" class="empty-state">Vous n’avez pas encore publié d’annonce.</p>
        <IonButton expand="block" fill="outline" @click="signOut">Se déconnecter</IonButton>
      </template>

      <template v-else>
        <h2>{{ register ? 'Créer un compte' : 'Connexion' }}</h2>
        <IonList>
          <IonItem v-if="register"><IonInput v-model="name" label="Nom" label-placement="stacked" /></IonItem>
          <IonItem><IonInput v-model="email" type="email" label="Email" label-placement="stacked" /></IonItem>
          <IonItem><IonInput v-model="password" type="password" label="Mot de passe" label-placement="stacked" /></IonItem>
        </IonList>
        <IonButton expand="block" :disabled="busy" @click="submit">
          {{ register ? 'Créer mon compte' : 'Se connecter' }}
        </IonButton>
        <IonButton expand="block" fill="clear" @click="register = !register">
          {{ register ? 'J’ai déjà un compte' : 'Créer un compte' }}
        </IonButton>
      </template>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonAvatar, IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonPage, IonTitle, IonToolbar,
  toastController,
} from '@ionic/vue'
import {
  createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword,
  signOut as firebaseSignOut, updateProfile, type User,
} from 'firebase/auth'
import { personCircle } from 'ionicons/icons'
import { ref } from 'vue'
import { auth, firebaseEnabled } from '../firebase'
import { listMyItems } from '../services/items'
import type { FindItItem } from '../types'

const user = ref<User | null>(null)
const name = ref('')
const email = ref('')
const password = ref('')
const register = ref(false)
const busy = ref(false)
const myItems = ref<FindItItem[]>([])

if (auth) {
  onAuthStateChanged(auth, async (nextUser) => {
    user.value = nextUser
    myItems.value = nextUser ? await listMyItems(nextUser.uid) : []
  })
}

async function submit() {
  if (!auth || !firebaseEnabled) return
  busy.value = true
  try {
    if (register.value) {
      const result = await createUserWithEmailAndPassword(auth, email.value, password.value)
      if (name.value.trim()) await updateProfile(result.user, { displayName: name.value.trim() })
    } else {
      await signInWithEmailAndPassword(auth, email.value, password.value)
    }
  } catch (error) {
    const toast = await toastController.create({ message: String(error), duration: 3000, color: 'danger' })
    await toast.present()
  } finally {
    busy.value = false
  }
}

async function signOut() {
  if (auth) await firebaseSignOut(auth)
}
</script>
