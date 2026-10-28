export type ModuleStatus = 'UP_TO_DATE' | 'OUTDATED'
export type KnowledgeType = 'TABLE' | 'PARAM' | 'FAQ'
export type JobStatus = 'SUCCESS' | 'FAILED'
export type IntegrationStatus = 'OPERATIONAL' | 'UNSTABLE' | 'FAILED'
export type TicketCategory = 'FIX' | 'IMPROVEMENT'
export type TicketTarget = 'TOTVS' | 'CONSULTANCY'
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_TOTVS' | 'DONE'

export interface ProtheusModule {
  id: string
  code: string
  name: string
  description?: string | null
  status: ModuleStatus
  currentVersion?: string | null
  lastUpdateAt?: string | null
}

export interface ProtheusPatch {
  id: string
  moduleId: string
  version: string
  description: string
  appliedAt: string
}

export interface ProtheusCustomizationChangelog {
  id: string
  version: string
  date: string
  author?: string | null
  description: string
}

export interface ProtheusCustomization {
  id: string
  file: string
  moduleId: string
  description: string
  author?: string | null
  inProductionAt?: string | null
  changelog: ProtheusCustomizationChangelog[]
}

export interface ProtheusKnowledgeField {
  id: string
  name: string
  description: string
}

export interface ProtheusKnowledgeItem {
  id: string
  slug: string
  type: KnowledgeType
  title: string
  summary: string
  moduleId?: string | null
  relationships?: string | null
  possibleValues?: string | null
  steps: string[]
  fields: ProtheusKnowledgeField[]
}

export interface ProtheusJob {
  id: string
  name: string
  description: string
  schedule: string
  lastRunAt?: string | null
  nextRunAt?: string | null
  status: JobStatus
}

export interface ProtheusIntegration {
  id: string
  name: string
  description: string
  status: IntegrationStatus
  lastFailureAt?: string | null
}

export interface ProtheusModuleDetail extends ProtheusModule {
  patches: ProtheusPatch[]
  customizations: Omit<ProtheusCustomization, 'changelog'>[]
}

export interface ProtheusTicket {
  id: string
  number: string
  title: string
  category: TicketCategory
  target: TicketTarget
  status: TicketStatus
  openedAt: string
}
