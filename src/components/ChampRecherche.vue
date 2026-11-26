<script setup lang="ts">
import { IonSearchbar } from '@ionic/vue';

defineProps<{ modelValue: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>();
</script>

<template>
  <ion-searchbar
      :value="modelValue"
      :debounce="300"
      placeholder="Rechercher un objet…"
      @ionInput="emit('update:modelValue', String($event.detail.value ?? ''))"
  />
</template>
