<script setup lang="ts">
import { computed } from 'vue';
import { IonBadge } from '@ionic/vue';
import type { StatutType } from '@/models/statut.model';
import { libelleStatut } from '@/services/statutService';

const props = defineProps<{ statut: StatutType }>();
const couleur = computed(() => ({ perdu: 'danger', retrouve: 'success', recupere: 'medium' }[props.statut]));
</script>

<template>
  <ion-badge :color="couleur">{{ libelleStatut(statut) }}</ion-badge>
</template>
