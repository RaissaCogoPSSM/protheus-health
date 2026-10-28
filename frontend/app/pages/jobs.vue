<script setup lang="ts">
import type { ProtheusJob } from '~/types/protheus'

const { data: jobsData, refresh: refreshJobs } = await useApi<ProtheusJob[]>('/jobs')
const jobs = computed(() => jobsData.value ?? [])

const showCreateDialog = ref(false)

async function onJobCreated() {
  showCreateDialog.value = false
  await refreshJobs()
}
</script>

<template>
  <div>
    <PageHeader title="Jobs" subtitle="Jobs agendados (SIGAADV)">
      <template #actions>
        <button type="button" class="btn-primary" @click="showCreateDialog = true">Adicionar</button>
      </template>
    </PageHeader>

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

    <JobFormDialog v-if="showCreateDialog" @close="showCreateDialog = false" @created="onJobCreated" />
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
