<script setup lang="ts">
import type { ProtheusKnowledgeItem, ProtheusModule } from '~/types/protheus'

const props = defineProps<{
  modules: ProtheusModule[]
}>()

const emit = defineEmits<{ close: []; created: [ProtheusKnowledgeItem] }>()

const slug = ref('')
const title = ref('')
const summary = ref('')
const moduleId = ref('')
const stepsText = ref('')

const saving = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  saving.value = true
  try {
    const steps = stepsText.value
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    const created = await apiFetch<ProtheusKnowledgeItem>('/knowledge-items/faq', {
      method: 'POST',
      body: {
        slug: slug.value,
        title: title.value,
        summary: summary.value,
        moduleId: moduleId.value || undefined,
        steps,
      },
    })
    emit('created', created)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Não foi possível salvar a FAQ.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Modal title="Nova FAQ" @close="emit('close')">
    <form class="form" @submit.prevent="onSubmit">
      <label>
        <span>Slug *</span>
        <input v-model="slug" type="text" placeholder="faq_boleto" required />
      </label>

      <label>
        <span>Título *</span>
        <input v-model="title" type="text" placeholder="Como emitir um boleto avulso" required />
      </label>

      <label>
        <span>Resumo *</span>
        <textarea v-model="summary" rows="2" placeholder="Resumo curto da pergunta" required />
      </label>

      <label>
        <span>Módulo</span>
        <select v-model="moduleId">
          <option value="">Geral</option>
          <option v-for="m in props.modules" :key="m.id" :value="m.id">{{ m.code }} — {{ m.name }}</option>
        </select>
      </label>

      <label>
        <span>Passo a passo * (um por linha)</span>
        <textarea v-model="stepsText" rows="5" placeholder="Acesse o menu Financeiro...&#10;Selecione o título...&#10;Clique em Emitir boleto" required />
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
