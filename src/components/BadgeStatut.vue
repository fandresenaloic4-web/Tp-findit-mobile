<script setup lang="ts">
import { computed } from 'vue';
import { IonBadge } from '@ionic/vue';
import type { StatutType } from '@/models/statut.model';
import { libelleStatut } from '@/services/statutService';
import { COULEURS_STATUT } from '@/utils/constantes';

const props = defineProps<{ statut: StatutType }>();
const couleur = computed(() => COULEURS_STATUT[props.statut]);
</script>

<template>
  <ion-badge :color="couleur">{{ libelleStatut(statut) }}</ion-badge>
</template>
