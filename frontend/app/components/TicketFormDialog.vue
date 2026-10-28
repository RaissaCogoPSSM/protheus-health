<script setup lang="ts">
import type { ProtheusTicket } from '~/types/protheus'

const emit = defineEmits<{ close: []; created: [ProtheusTicket] }>()

const number = ref('')
const title = ref('')
const category = ref<'FIX' | 'IMPROVEMENT'>('FIX')
const target = ref<'TOTVS' | 'CONSULTANCY'>('TOTVS')
const status = ref<'OPEN' | 'IN_PROGRESS' | 'WAITING_TOTVS' | 'DONE'>('OPEN')

const saving = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  saving.value = true
  try {
    const created = await apiFetch<ProtheusTicket>('/tickets', {
      method: 'POST',
      body: {
        number: number.value,
        title: title.value,
        category: category.value,
        target: target.value,
        status: status.value,
      },
    })
    emit('created', created)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Não foi possível salvar o chamado.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Modal title="Novo chamado" @close="emit('close')">
    <form class="form" @submit.prevent="onSubmit">
      <label>
        <span>Número *</span>
        <input v-model="number" type="text" placeholder="4821" required />
      </label>

      <label>
        <span>Assunto *</span>
        <input v-model="title" type="text" placeholder="Descrição do chamado" required />
      </label>

      <label>
        <span>Categoria</span>
        <select v-model="category">
          <option value="FIX">Correção</option>
          <option value="IMPROVEMENT">Melhoria</option>
        </select>
      </label>

      <label>
        <span>Destino</span>
        <select v-model="target">
          <option value="TOTVS">TOTVS</option>
          <option value="CONSULTANCY">Consultoria</option>
        </select>
      </label>

      <label>
        <span>Status</span>
        <select v-model="status">
          <option value="OPEN">Aberto</option>
          <option value="IN_PROGRESS">Em andamento</option>
          <option value="WAITING_TOTVS">Aguardando TOTVS</option>
          <option value="DONE">Concluído</option>
        </select>
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="form-actions">
        <button type="button" class="btn-ghost" @click="emit('close')">Cancelar</button>
        <button type="submit" class="btn-primary" :disabled="saving">
          {{ saving ? 'Salvando…' : 'Salvar' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12.5px;
  color: var(--ink-soft);
}

input,
select,
textarea {
  font: inherit;
  font-size: 13.5px;
  color: var(--ink);
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  outline: 2px solid var(--accent-soft);
  border-color: var(--accent);
}

.error {
  margin: 0;
  font-size: 12.5px;
  color: var(--danger);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}

.btn-primary {
  border: 1px solid var(--accent);
  background: var(--accent);
  color: var(--accent-contrast);
  font-weight: 600;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: wait;
}

.btn-ghost {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--ink-soft);
  font-size: 13px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
</style>
