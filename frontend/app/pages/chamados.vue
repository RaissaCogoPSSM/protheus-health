<script setup lang="ts">
import type { ProtheusTicket, TicketCategory, TicketTarget } from '~/types/protheus'

const { data: ticketsData, refresh: refreshTickets } = await useApi<ProtheusTicket[]>('/tickets')
const tickets = computed(() => ticketsData.value ?? [])

const categoryLabel: Record<TicketCategory, string> = {
  FIX: 'Correção',
  IMPROVEMENT: 'Melhoria'
}

const targetLabel: Record<TicketTarget, string> = {
  TOTVS: 'TOTVS',
  CONSULTANCY: 'Consultoria'
}

const showCreateDialog = ref(false)

async function onTicketCreated() {
  showCreateDialog.value = false
  await refreshTickets()
}
</script>

<template>
  <div>
    <PageHeader title="Chamados" subtitle="Chamados TOTVS / Consultoria">
      <template #actions>
        <button type="button" class="btn-primary" @click="showCreateDialog = true">Adicionar</button>
      </template>
    </PageHeader>

    <UiCard class="table-card">
      <table class="table">
        <thead>
          <tr>
            <th>Nº</th>
            <th>Assunto</th>
            <th>Categoria</th>
            <th>Destino</th>
            <th>Aberto em</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tickets" :key="t.id">
            <td><strong>#{{ t.number }}</strong></td>
            <td>{{ t.title }}</td>
            <td>{{ categoryLabel[t.category] }}</td>
            <td>{{ targetLabel[t.target] }}</td>
            <td>{{ formatDate(t.openedAt) }}</td>
            <td>
              <StatusBadge
                :label="useTicketStatus(t.status).label"
                :tone="useTicketStatus(t.status).tone as any"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </UiCard>

    <TicketFormDialog v-if="showCreateDialog" @close="showCreateDialog = false" @created="onTicketCreated" />
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
}

.table tr:last-child td {
  border-bottom: none;
}
</style>
