<script setup lang="ts">
import type { ProtheusIntegration } from '~/types/protheus'

const { data: integrationsData, refresh: refreshIntegrations } = await useApi<ProtheusIntegration[]>('/integrations')
const integrations = computed(() => integrationsData.value ?? [])

const showCreateDialog = ref(false)

async function onIntegrationCreated() {
  showCreateDialog.value = false
  await refreshIntegrations()
}
</script>

<template>
  <div>
    <PageHeader title="Integrações" subtitle="Integrações externas">
      <template #actions>
        <button type="button" class="btn-primary" @click="showCreateDialog = true">Adicionar</button>
      </template>
    </PageHeader>

    <div class="grid">
      <UiCard v-for="i in integrations" :key="i.id" class="integration">
        <div class="head">
          <strong>{{ i.name }}</strong>
          <StatusBadge
            :label="useIntegrationStatus(i.status).label"
            :tone="useIntegrationStatus(i.status).tone as any"
          />
        </div>
        <p>{{ i.description }}</p>
        <span class="failure">
          Última falha: {{ i.lastFailureAt ? formatDate(i.lastFailureAt) : 'nunca' }}
        </span>
      </UiCard>
    </div>

    <IntegrationFormDialog v-if="showCreateDialog" @close="showCreateDialog = false" @created="onIntegrationCreated" />
  </div>
</template>

<style scoped>
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

.integration {
  padding: 18px 20px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.head strong {
  font-size: 14.5px;
  color: var(--ink);
}

p {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--ink-soft);
}

.failure {
  font-size: 11.5px;
  color: var(--ink-faint);
}
</style>
