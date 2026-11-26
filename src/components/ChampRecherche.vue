<script setup lang="ts">
import { IonSearchbar } from '@ionic/vue';

defineProps<{ modelValue: string }>();
const emit = defineEmits<{
  'update:modelValue': [valeur: string];
}>();

function surSaisie(evenement: Event): void {
  const valeur = (evenement as CustomEvent<{ value: string | null }>).detail.value ?? '';
  emit('update:modelValue', valeur);
}
</script>

<template>
  <ion-searchbar
    :value="modelValue"
    :debounce="300"
    placeholder="Rechercher un objet…"
    @ionInput="surSaisie"
  />
</template>
