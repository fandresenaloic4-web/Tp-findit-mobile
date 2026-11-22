<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet />
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <IonIcon :icon="homeOutline" />
          <IonLabel>Accueil</IonLabel>
        </IonTabButton>
        <IonTabButton tab="publish" href="/publish">
          <IonIcon :icon="addCircleOutline" />
          <IonLabel>Publier</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile">
          <IonIcon :icon="personOutline" />
          <IonLabel>Profil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
</template>

<script setup lang="ts">
import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue'
import { addCircleOutline, homeOutline, personOutline } from 'ionicons/icons'
</script>
