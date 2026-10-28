<script setup lang="ts">
interface SyncSummary {
  fetched: number
  upserted: number
  skipped: number
  skippedReasons: string[]
}

interface SyncState {
  status: 'idle' | 'running' | 'done' | 'error'
  startedAt?: string
  finishedAt?: string
  summary?: SyncSummary
  error?: string
}

const emit = defineEmits<{ done: [] }>()

const state = ref<SyncState>({ status: 'idle' })
let pollTimer: ReturnType<typeof setInterval> | null = null

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

async function refreshState() {
  const next = await apiFetch<SyncState>('/sync/updates')
  const wasRunning = state.value.status === 'running'
  state.value = next
  if (next.status === 'running') {
    if (!pollTimer) pollTimer = setInterval(refreshState, 3000)
  } else {
    stopPolling()
    if (wasRunning) emit('done')
  }
}

async function trigger() {
  state.value = await apiFetch<SyncState>('/sync/updates', { method: 'POST' })
  if (!pollTimer) pollTimer = setInterval(refreshState, 3000)
}

onMounted(refreshState)
onUnmounted(stopPolling)

const isRunning = computed(() => state.value.status === 'running')
const label = computed(() => (isRunning.value ? 'Sincronizando…' : 'Sincronizar agora'))
</script>

<template>
  <div class="sync">
    <button type="button" class="sync-btn" :disabled="isRunning" @click="trigger">
      {{ label }}
    </button>
    <span v-if="state.status === 'done' && state.summary" class="sync-result">
      {{ state.summary.upserted }} atualizados · {{ state.summary.skipped }} ignorados
    </span>
    <span v-else-if="state.status === 'error'" class="sync-result is-error">
      Falha: {{ state.error }}
    </span>
  </div>
</template>

<style scoped>
.sync {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sync-btn {
  border: 1px solid var(--accent);
  background: var(--accent);
  color: var(--accent-contrast);
  font-weight: 600;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.sync-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.sync-result {
  font-size: 12px;
  color: var(--ink-faint);
}

.sync-result.is-error {
  color: var(--danger);
}
</style>
