<script setup lang="ts">
import { integrations } from '~/data/mock'
</script>

<template>
  <div>
    <PageHeader title="Integrações" subtitle="Integrações externas" />

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
          Última falha: {{ i.lastFailureAt ?? 'nunca' }}
        </span>
      </UiCard>
    </div>
  </div>
</template>

<style scoped>
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
