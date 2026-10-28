<script setup lang="ts">
import { customizations, integrations, jobs, modules, tickets } from '~/data/mock'

const outdatedModules = computed(() => modules.filter((m) => m.status === 'OUTDATED'))
const failedJobs = computed(() => jobs.filter((j) => j.status === 'FAILED'))
const openTickets = computed(() => tickets.filter((t) => t.status !== 'DONE'))
const unstableIntegrations = computed(() => integrations.filter((i) => i.status !== 'OPERATIONAL'))

const stats = computed(() => [
  {
    label: 'Saúde dos módulos',
    value: `${modules.length - outdatedModules.value.length}/${modules.length}`,
    hint: 'em dia',
    tone: outdatedModules.value.length ? 'warning' : 'success'
  },
  {
    label: 'Customizações ativas',
    value: String(customizations.length),
    hint: 'em produção',
    tone: 'info'
  },
  {
    label: 'Jobs com falha recente',
    value: String(failedJobs.value.length),
    hint: `de ${jobs.length} jobs`,
    tone: failedJobs.value.length ? 'danger' : 'success'
  },
  {
    label: 'Chamados TOTVS abertos',
    value: String(openTickets.value.length),
    hint: 'em aberto',
    tone: openTickets.value.length ? 'warning' : 'success'
  }
])
</script>

<template>
  <div>
    <PageHeader title="Dashboard" subtitle="Visão geral do ambiente Protheus" />

    <div class="stats">
      <UiCard v-for="stat in stats" :key="stat.label" class="stat">
        <span class="stat-label">{{ stat.label }}</span>
        <strong class="stat-value">{{ stat.value }}</strong>
        <StatusBadge :label="stat.hint" :tone="stat.tone as any" />
      </UiCard>
    </div>

    <div class="grid">
      <UiCard class="panel">
        <h2>Módulos desatualizados</h2>
        <ul v-if="outdatedModules.length" class="list">
          <li v-for="m in outdatedModules" :key="m.id">
            <div>
              <strong>{{ m.code }}</strong>
              <span>{{ m.name }}</span>
            </div>
            <StatusBadge label="Desatualizado" tone="warning" />
          </li>
        </ul>
        <EmptyState v-else message="Todos os módulos estão em dia." />
      </UiCard>

      <UiCard class="panel">
        <h2>Jobs com falha</h2>
        <ul v-if="failedJobs.length" class="list">
          <li v-for="j in failedJobs" :key="j.id">
            <div>
              <strong>{{ j.name }}</strong>
              <span>{{ j.description }}</span>
            </div>
            <StatusBadge label="Falhou" tone="danger" />
          </li>
        </ul>
        <EmptyState v-else message="Nenhum job com falha recente." />
      </UiCard>

      <UiCard class="panel">
        <h2>Integrações instáveis</h2>
        <ul v-if="unstableIntegrations.length" class="list">
          <li v-for="i in unstableIntegrations" :key="i.id">
            <div>
              <strong>{{ i.name }}</strong>
              <span>{{ i.description }}</span>
            </div>
            <StatusBadge :label="i.status === 'FAILED' ? 'Falhou' : 'Instável'" :tone="i.status === 'FAILED' ? 'danger' : 'warning'" />
          </li>
        </ul>
        <EmptyState v-else message="Todas as integrações operacionais." />
      </UiCard>

      <UiCard class="panel">
        <h2>Chamados em aberto</h2>
        <ul v-if="openTickets.length" class="list">
          <li v-for="t in openTickets" :key="t.id">
            <div>
              <strong>#{{ t.number }}</strong>
              <span>{{ t.title }}</span>
            </div>
            <StatusBadge :label="useTicketStatus(t.status).label" :tone="useTicketStatus(t.status).tone as any" />
          </li>
        </ul>
        <EmptyState v-else message="Nenhum chamado em aberto." />
      </UiCard>
    </div>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.stat {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font-size: 12.5px;
  color: var(--ink-soft);
  font-weight: 600;
}

.stat-value {
  font-size: 26px;
  color: var(--ink);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.panel {
  padding: 18px 20px;
}

.panel h2 {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--ink);
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--border);
}

.list li:first-child {
  border-top: none;
  padding-top: 0;
}

.list li > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.list li strong {
  font-size: 13px;
  color: var(--ink);
}

.list li span {
  font-size: 12.5px;
  color: var(--ink-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
