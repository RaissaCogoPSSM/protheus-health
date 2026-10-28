<script setup lang="ts">
import type { ProtheusCustomization, ProtheusModule } from '~/types/protheus'

const { data: customizationsData } = await useApi<ProtheusCustomization[]>('/customizations')
const { data: modulesData } = await useApi<ProtheusModule[]>('/modules')

const customizations = computed(() => customizationsData.value ?? [])
const modules = computed(() => modulesData.value ?? [])

const selectedId = ref<string | null>(null)
watch(
  customizations,
  (list) => {
    if (!selectedId.value && list.length) selectedId.value = list[0].id
  },
  { immediate: true }
)

const selected = computed(() => customizations.value.find((c) => c.id === selectedId.value) ?? null)

function moduleName(moduleId: string) {
  return modules.value.find((m) => m.id === moduleId)?.code ?? '—'
}
</script>

<template>
  <div>
    <PageHeader title="Rotinas AdvPL" subtitle="Catálogo de rotinas AdvPL · cadastro de customizações" />

    <MasterDetail>
      <template #list>
        <ListItemButton
          v-for="c in customizations"
          :key="c.id"
          :active="c.id === selectedId"
          @click="selectedId = c.id"
        >
          <div class="row">
            <strong>{{ c.file }}</strong>
            <span>{{ moduleName(c.moduleId) }}</span>
          </div>
        </ListItemButton>
      </template>

      <template #detail>
        <template v-if="selected">
          <div class="detail-head">
            <div>
              <h2>{{ selected.file }}</h2>
              <p>{{ selected.description }}</p>
            </div>
          </div>

          <dl class="meta">
            <div>
              <dt>Módulo</dt>
              <dd>{{ moduleName(selected.moduleId) }}</dd>
            </div>
            <div>
              <dt>Responsável</dt>
              <dd>{{ selected.author ?? '—' }}</dd>
            </div>
            <div>
              <dt>Em produção desde</dt>
              <dd>{{ selected.inProductionAt ?? '—' }}</dd>
            </div>
          </dl>

          <h3>Changelog</h3>
          <ul v-if="selected.changelog.length" class="changelog">
            <li v-for="entry in selected.changelog" :key="entry.id">
              <div class="changelog-head">
                <strong>v{{ entry.version }}</strong>
                <span>{{ entry.date }}</span>
              </div>
              <p>{{ entry.description }}</p>
              <span v-if="entry.author" class="changelog-author">{{ entry.author }}</span>
            </li>
          </ul>
          <EmptyState v-else message="Nenhuma entrada de changelog." />
        </template>
        <EmptyState v-else message="Selecione uma rotina para ver o changelog." />
      </template>
    </MasterDetail>
  </div>
</template>

<style scoped>
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
}

.detail-head h2 {
  margin: 0 0 4px;
  font-size: 17px;
}

.detail-head p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 13.5px;
}

.meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
  margin: 20px 0 24px;
  padding: 14px 16px;
  background: var(--bg);
  border-radius: var(--radius-md);
}

.meta dt {
  font-size: 11.5px;
  color: var(--ink-faint);
  margin-bottom: 2px;
}

.meta dd {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

h3 {
  font-size: 13.5px;
  color: var(--ink);
  margin: 0 0 10px;
}

.changelog {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.changelog li {
  padding-left: 14px;
  border-left: 2px solid var(--border);
}

.changelog-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.changelog-head strong {
  font-size: 13px;
  color: var(--ink);
}

.changelog-head span {
  font-size: 11.5px;
  color: var(--ink-faint);
}

.changelog p {
  margin: 4px 0 2px;
  font-size: 13px;
  color: var(--ink-soft);
}

.changelog-author {
  font-size: 11.5px;
  color: var(--ink-faint);
}
</style>
