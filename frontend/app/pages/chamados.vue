<script setup lang="ts">
import type { ProtheusTicket, TicketCategory, TicketTarget } from '~/types/protheus'

const { data: ticketsData } = await useApi<ProtheusTicket[]>('/tickets')
const tickets = computed(() => ticketsData.value ?? [])

const categoryLabel: Record<TicketCategory, string> = {
  FIX: 'Correção',
  IMPROVEMENT: 'Melhoria'
}

const targetLabel: Record<TicketTarget, string> = {
  TOTVS: 'TOTVS',
  CONSULTANCY: 'Consultoria'
}
</script>

<template>
  <div>
    <PageHeader title="Chamados" subtitle="Chamados TOTVS / Consultoria" />

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
            <td>{{ t.openedAt }}</td>
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
}

.table tr:last-child td {
  border-bottom: none;
}
</style>
