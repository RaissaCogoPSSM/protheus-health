<script setup lang="ts">
import { jobs } from '~/data/mock'

function formatDateTime(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}
</script>

<template>
  <div>
    <PageHeader title="Jobs" subtitle="Jobs agendados (SIGAADV)" />

    <UiCard class="table-card">
      <table class="table">
        <thead>
          <tr>
            <th>Job</th>
            <th>Descrição</th>
            <th>Agendamento</th>
            <th>Última execução</th>
            <th>Próxima execução</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="j in jobs" :key="j.id">
            <td><strong>{{ j.name }}</strong></td>
            <td>{{ j.description }}</td>
            <td>{{ j.schedule }}</td>
            <td>{{ formatDateTime(j.lastRunAt) }}</td>
            <td>{{ formatDateTime(j.nextRunAt) }}</td>
            <td>
              <StatusBadge
                :label="useJobStatus(j.status).label"
                :tone="useJobStatus(j.status).tone as any"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </UiCard>
  </div>
</template>

<style scoped>
.table-card {
  padding: 8px;
  overflow-x: auto;
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
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--ink-soft);
  white-space: nowrap;
}

.table tr:last-child td {
  border-bottom: none;
}
</style>
