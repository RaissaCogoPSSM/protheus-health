<script setup lang="ts">
defineProps<{ active?: boolean }>()
const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button type="button" class="item" :class="{ 'is-active': active }" @click="emit('click')">
    <slot />
  </button>
</template>

<style scoped>
.item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 11px 12px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font: inherit;
  color: inherit;
}

.item:hover {
  background: var(--bg);
}

.item.is-active {
  background: var(--accent-soft);
}
</style>
