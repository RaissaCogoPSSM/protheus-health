<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <div class="empty">
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 240px;
  color: var(--ink-faint);
  font-size: 13.5px;
  text-align: center;
  padding: 24px;
}
</style>
