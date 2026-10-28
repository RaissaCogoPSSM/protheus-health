<script setup lang="ts">
type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const props = defineProps<{
  label: string
  tone?: Tone
}>()

const tone = computed(() => props.tone ?? 'neutral')
</script>

<template>
  <span class="badge" :class="`is-${tone}`">{{ label }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.6;
  white-space: nowrap;
}

.is-success {
  color: var(--success);
  background: var(--success-soft);
}

.is-warning {
  color: var(--warning);
  background: var(--warning-soft);
}

.is-danger {
  color: var(--danger);
  background: var(--danger-soft);
}

.is-info {
  color: var(--info);
  background: var(--info-soft);
}

.is-neutral {
  color: var(--ink-soft);
  background: var(--border);
}
</style>
