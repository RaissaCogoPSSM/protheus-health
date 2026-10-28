<script setup lang="ts">
defineProps<{
  title: string
}>()

const emit = defineEmits<{ close: [] }>()

function onBackdrop(event: MouseEvent) {
  if (event.target === event.currentTarget) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div class="backdrop" @click="onBackdrop" @keydown.esc="emit('close')">
      <div class="modal" role="dialog" aria-modal="true">
        <header>
          <h2>{{ title }}</h2>
          <button type="button" class="close-btn" aria-label="Fechar" @click="emit('close')">×</button>
        </header>
        <div class="body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 35, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 100;
}

.modal {
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

h2 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  color: var(--ink-faint);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.close-btn:hover {
  background: var(--bg);
  color: var(--ink);
}

.body {
  padding: 20px;
}
</style>
