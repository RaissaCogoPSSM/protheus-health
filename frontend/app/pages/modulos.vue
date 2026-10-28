<script setup lang="ts">
import type { ProtheusModule, ProtheusModuleDetail } from '~/types/protheus'

const { data: modulesData } = await useApi<ProtheusModule[]>('/modules')
const modules = computed(() => modulesData.value ?? [])

const selectedId = ref<string | null>(null)
const selected = ref<ProtheusModuleDetail | null>(null)

async function loadDetail(id: string) {
  selected.value = await apiFetch<ProtheusModuleDetail>(`/modules/${id}`)
}

watch(
  modules,
  (list) => {
    if (!selectedId.value && list.length) selectedId.value = list[0].id
  },
  { immediate: true }
)

watch(
  selectedId,
  (id) => {
    if (id) loadDetail(id)
  },
  { immediate: true }
)

const modulePatches = computed(() => selected.value?.patches ?? [])
const moduleCustomizations = computed(() => selected.value?.customizations ?? [])
</script>

<template>
  <div>
    <PageHeader title="Módulos" subtitle="Saúde dos módulos e pacotes/patches aplicados" />

    <MasterDetail>
      <template #list>
        <ListItemButton
          v-for="m in modules"
          :key="m.id"
          :active="m.id === selectedId"
          @click="selectedId = m.id"
        >
          <div class="row">
            <div>
              <strong>{{ m.code }}</strong>
              <span>{{ m.name }}</span>
            </div>
            <StatusBadge
              :label="useModuleStatus(m.status).label"
              :tone="useModuleStatus(m.status).tone as any"
            />
          </div>
        </ListItemButton>
      </template>

      <template #detail>
        <template v-if="selected">
          <div class="detail-head">
            <div>
              <h2>{{ selected.code }} — {{ selected.name }}</h2>
              <p>{{ selected.description }}</p>
            </div>
            <StatusBadge
              :label="useModuleStatus(selected.status).label"
              :tone="useModuleStatus(selected.status).tone as any"
            />
          </div>

          <dl class="meta">
            <div>
              <dt>Versão atual</dt>
              <dd>{{ selected.currentVersion ?? '—' }}</dd>
            </div>
            <div>
              <dt>Última atualização</dt>
              <dd>{{ selected.lastUpdateAt ?? '—' }}</dd>
            </div>
            <div>
              <dt>Customizações neste módulo</dt>
              <dd>{{ moduleCustomizations.length }}</dd>
            </div>
          </dl>

          <h3>Pacotes / patches aplicados</h3>
          <table v-if="modulePatches.length" class="table">
            <thead>
              <tr>
                <th>Versão</th>
                <th>Descrição</th>
                <th>Aplicado em</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in modulePatches" :key="p.id">
                <td>{{ p.version }}</td>
                <td>{{ p.description }}</td>
                <td>{{ p.appliedAt }}</td>
              </tr>
            </tbody>
          </table>
          <EmptyState v-else message="Nenhum patch registrado para este módulo." />
        </template>
        <EmptyState v-else message="Selecione um módulo à esquerda para ver os detalhes." />
      </template>
    </MasterDetail>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.row div {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.row strong {
  font-size: 13.5px;
}

.row span {
  font-size: 12px;
  color: var(--ink-faint);
}

.detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
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

.table tr:last-child td {
  border-bottom: none;
}
</style>
