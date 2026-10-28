import type {
  IntegrationStatus,
  JobStatus,
  ModuleStatus,
  TicketStatus
} from '~/types/protheus'

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const moduleStatusMap: Record<ModuleStatus, { label: string; tone: Tone }> = {
  UP_TO_DATE: { label: 'Em dia', tone: 'success' },
  OUTDATED: { label: 'Desatualizado', tone: 'warning' }
}

const jobStatusMap: Record<JobStatus, { label: string; tone: Tone }> = {
  SUCCESS: { label: 'Sucesso', tone: 'success' },
  FAILED: { label: 'Falhou', tone: 'danger' }
}

const integrationStatusMap: Record<IntegrationStatus, { label: string; tone: Tone }> = {
  OPERATIONAL: { label: 'Operacional', tone: 'success' },
  UNSTABLE: { label: 'Instável', tone: 'warning' },
  FAILED: { label: 'Falhou', tone: 'danger' }
}

const ticketStatusMap: Record<TicketStatus, { label: string; tone: Tone }> = {
  OPEN: { label: 'Aberto', tone: 'info' },
  IN_PROGRESS: { label: 'Em andamento', tone: 'warning' },
  WAITING_TOTVS: { label: 'Aguardando TOTVS', tone: 'warning' },
  DONE: { label: 'Concluído', tone: 'success' }
}

export function useModuleStatus(status: ModuleStatus) {
  return moduleStatusMap[status]
}

export function useJobStatus(status: JobStatus) {
  return jobStatusMap[status]
}

export function useIntegrationStatus(status: IntegrationStatus) {
  return integrationStatusMap[status]
}

export function useTicketStatus(status: TicketStatus) {
  return ticketStatusMap[status]
}
