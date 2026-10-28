<script setup lang="ts">
import type { KnowledgeType, ProtheusKnowledgeItem } from '~/types/protheus'

const tabs: { key: KnowledgeType; label: string }[] = [
  { key: 'TABLE', label: 'Tabelas' },
  { key: 'PARAM', label: 'Parâmetros' },
  { key: 'FAQ', label: 'FAQ' }
]

const { data: itemsData } = await useApi<ProtheusKnowledgeItem[]>('/knowledge-items')
const knowledgeItems = computed(() => itemsData.value ?? [])

const activeTab = ref<KnowledgeType>('TABLE')
const filtered = computed(() => knowledgeItems.value.filter((i) => i.type === activeTab.value))

const selectedId = ref<string | null>(null)
const selected = computed(() => knowledgeItems.value.find((i) => i.id === selectedId.value) ?? null)

watch(filtered, (list) => {
  if (!list.some((i) => i.id === selectedId.value)) {
    selectedId.value = list[0]?.id ?? null
  }
}, { immediate: true })
</script>

<template>
  <div>
    <PageHeader title="Base de Conhecimento" subtitle="Tabelas, parâmetros e FAQs do ambiente Protheus" />

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="tab"
        :class="{ 'is-active': tab.key === activeTab }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <MasterDetail>
      <template #list>
        <ListItemButton
          v-for="item in filtered"
          :key="item.id"
          :active="item.id === selectedId"
          @click="selectedId = item.id"
        >
          <div class="row">
            <strong>{{ item.title }}</strong>
            <span>{{ item.summary }}</span>
          </div>
        </ListItemButton>
        <EmptyState v-if="!filtered.length" message="Nenhum item nesta categoria." />
      </template>

      <template #detail>
        <template v-if="selected">
          <h2>{{ selected.title }}</h2>
          <p class="summary">{{ selected.summary }}</p>

          <template v-if="selected.type === 'TABLE'">
            <h3>Relacionamentos</h3>
            <p class="meta-text">{{ selected.relationships ?? '—' }}</p>

            <h3>Campos</h3>
            <table v-if="selected.fields.length" class="table">
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="f in selected.fields" :key="f.id">
                  <td><code>{{ f.name }}</code></td>
                  <td>{{ f.description }}</td>
                </tr>
              </tbody>
            </table>
          </template>

          <template v-else-if="selected.type === 'PARAM'">
            <h3>Valores possíveis</h3>
            <p class="meta-text">{{ selected.possibleValues ?? '—' }}</p>
          </template>

          <template v-else>
            <h3>Passo a passo</h3>
            <ol class="steps">
              <li v-for="(step, idx) in selected.steps" :key="idx">{{ step }}</li>
            </ol>
          </template>
        </template>
        <EmptyState v-else message="Selecione um item à esquerda para ver os detalhes." />
      </template>
    </MasterDetail>
  </div>
</template>

<style scoped>
.tabs {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: var(--bg);
  border-radius: var(--radius-pill);
  margin-bottom: 16px;
}

.tab {
  border: none;
  background: transparent;
  padding: 7px 16px;
  border-radius: var(--radius-pill);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-soft);
  cursor: pointer;
}

.tab.is-active {
  background: var(--surface);
  color: var(--accent-strong);
  box-shadow: var(--shadow-sm);
}

.row {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.row strong {
  font-size: 13.5px;
}

.row span {
  font-size: 12px;
  color: var(--ink-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

h2 {
  margin: 0 0 6px;
  font-size: 17px;
}

.summary {
  margin: 0 0 20px;
  color: var(--ink-soft);
  font-size: 13.5px;
}

h3 {
  font-size: 13.5px;
  color: var(--ink);
  margin: 0 0 10px;
}

.meta-text {
  font-size: 13.5px;
  color: var(--ink-soft);
  margin: 0 0 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th {
  text-align: left;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--ink-faint);
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
}

.table td {
  padding: 10px;
  border-bottom: 1px solid var(--border);
  color: var(--ink-soft);
}

.table code {
  background: var(--bg);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
}

.steps {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13.5px;
  color: var(--ink-soft);
}
</style>
