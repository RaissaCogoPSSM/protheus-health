<script setup lang="ts">
import type { ProtheusCustomization } from '~/types/protheus'

const props = defineProps<{
  customizationId: string
  customizationFile: string
}>()

const emit = defineEmits<{ close: []; added: [ProtheusCustomization] }>()

const version = ref('')
const date = ref(new Date().toISOString().slice(0, 10))
const author = ref('')
const description = ref('')

const saving = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  saving.value = true
  try {
    const updated = await apiFetch<ProtheusCustomization>(`/customizations/${props.customizationId}/changelog`, {
      method: 'POST',
      body: {
        version: version.value,
        date: date.value,
        author: author.value || undefined,
        description: description.value,
      },
    })
    emit('added', updated)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Não foi possível salvar o histórico.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Modal :title="`Novo histórico — ${props.customizationFile}`" @close="emit('close')">
    <form class="form" @submit.prevent="onSubmit">
      <label>
        <span>Versão *</span>
        <input v-model="version" type="text" placeholder="1.4" required />
      </label>

      <label>
        <span>Data *</span>
        <input v-model="date" type="date" required />
      </label>

      <label>
        <span>Responsável</span>
        <input v-model="author" type="text" placeholder="Nome do responsável" />
      </label>

      <label>
        <span>Descrição *</span>
        <textarea v-model="description" rows="3" placeholder="O que mudou nessa versão" required />
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
