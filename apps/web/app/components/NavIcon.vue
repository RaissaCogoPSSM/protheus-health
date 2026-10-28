<script setup lang="ts">
type IconName =
  | 'dashboard'
  | 'modules'
  | 'routines'
  | 'knowledge'
  | 'jobs'
  | 'integrations'
  | 'tickets'

defineProps<{ name: IconName }>()
</script>

<template>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <template v-if="name === 'dashboard'">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </template>
    <template v-else-if="name === 'modules'">
      <path d="M12 3 L21 8 L12 13 L3 8 Z" />
      <path d="M3 16 L12 21 L21 16" />
      <path d="M3 12 L12 17 L21 12" />
    </template>
    <template v-else-if="name === 'routines'">
      <path d="M16 18 L21 13 L16 8" />
      <path d="M8 6 L3 11 L8 16" />
      <path d="M13 4 L11 20" />
    </template>
    <template v-else-if="name === 'knowledge'">
      <path d="M4 5.5 C4 4.7 4.7 4 5.5 4 H12 V20 H5.5 C4.7 20 4 19.3 4 18.5 Z" />
      <path d="M20 5.5 C20 4.7 19.3 4 18.5 4 H12 V20 H18.5 C19.3 20 20 19.3 20 18.5 Z" />
    </template>
    <template v-else-if="name === 'jobs'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7 V12 L15.5 14" />
    </template>
    <template v-else-if="name === 'integrations'">
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="12" cy="18" r="3" />
      <path d="M8.5 7.5 L11 16" />
      <path d="M15.5 7.5 L13 16" />
    </template>
    <template v-else-if="name === 'tickets'">
      <path d="M3 8 C3 6.5 4 5.5 5.5 5.5 H18.5 C20 5.5 21 6.5 21 8 V9.5 C19.6 9.5 18.5 10.6 18.5 12 C18.5 13.4 19.6 14.5 21 14.5 V16 C21 17.5 20 18.5 18.5 18.5 H5.5 C4 18.5 3 17.5 3 16 V14.5 C4.4 14.5 5.5 13.4 5.5 12 C5.5 10.6 4.4 9.5 3 9.5 Z" />
    </template>
  </svg>
</template>
