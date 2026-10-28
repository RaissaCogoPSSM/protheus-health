<script setup lang="ts">
import type { ProtheusCustomization, ProtheusModule } from '~/types/protheus'

const props = defineProps<{
  modules: ProtheusModule[]
}>()

const emit = defineEmits<{ close: []; created: [ProtheusCustomization] }>()

const file = ref('')
const moduleId = ref(props.modules[0]?.id ?? '')
const description = ref('')
const author = ref('')
const inProductionAt = ref('')

const saving = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  saving.value = true
  try {
    const created = await apiFetch<ProtheusCustomization>('/customizations', {
      method: 'POST',
      body: {
        file: file.value,
        moduleId: moduleId.value,
        description: description.value,
        author: author.value || undefined,
        inProductionAt: inProductionAt.value || undefined,
      },
    })
    emit('created', created)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Não foi possível salvar a customização.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Modal title="Nova customização" @close="emit('close')">
    <form class="form" @submit.prevent="onSubmit">
      <label>
        <span>Arquivo *</span>
        <input v-model="file" type="text" placeholder="PSFAT010.prw" required />
      </label>

      <label>
        <span>Módulo *</span>
        <select v-model="moduleId" required>
          <option v-for="m in props.modules" :key="m.id" :value="m.id">{{ m.code }} — {{ m.name }}</option>
        </select>
      </label>

      <label>
        <span>Descrição *</span>
        <textarea v-model="description" rows="3" placeholder="O que essa rotina faz" required />
      </label>

      <label>
        <span>Responsável</span>
        <input v-model="author" type="text" placeholder="Nome do responsável" />
      </label>

      <label>
        <span>Em produção desde</span>
        <input v-model="inProductionAt" type="date" />
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
