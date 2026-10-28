import type {
  ProtheusCustomization,
  ProtheusIntegration,
  ProtheusJob,
  ProtheusKnowledgeItem,
  ProtheusModule,
  ProtheusPatch,
  ProtheusTicket
} from '~/types/protheus'

export const modules: ProtheusModule[] = [
  {
    id: 'mod-sigafat',
    code: 'SIGAFAT',
    name: 'Faturamento',
    description: 'Emissão de pedidos, NF-e e faturamento',
    status: 'UP_TO_DATE',
    currentVersion: '12.1.2210',
    lastUpdateAt: '2026-10-12'
  },
  {
    id: 'mod-sigaest',
    code: 'SIGAEST',
    name: 'Estoque e Custos',
    description: 'Controle de estoque, custo médio e inventário',
    status: 'OUTDATED',
    currentVersion: '12.1.2180',
    lastUpdateAt: '2026-06-03'
  },
  {
    id: 'mod-sigafin',
    code: 'SIGAFIN',
    name: 'Financeiro',
    description: 'Contas a pagar/receber, bancos e boletos',
    status: 'UP_TO_DATE',
    currentVersion: '12.1.2210',
    lastUpdateAt: '2026-10-12'
  },
  {
    id: 'mod-sigaadv',
    code: 'SIGAADV',
    name: 'Advanced Protheus',
    description: 'Scheduler, jobs e rotinas de automação',
    status: 'UP_TO_DATE',
    currentVersion: '12.1.2210',
    lastUpdateAt: '2026-10-12'
  },
  {
    id: 'mod-sigacom',
    code: 'SIGACOM',
    name: 'Compras',
    description: 'Cotação, pedido de compra e importação',
    status: 'OUTDATED',
    currentVersion: '12.1.2150',
    lastUpdateAt: '2026-03-18'
  }
]

export const patches: ProtheusPatch[] = [
  { id: 'p1', moduleId: 'mod-sigafat', version: '12.1.2210', description: 'Correção NF-e rejeição 539', appliedAt: '2026-10-12' },
  { id: 'p2', moduleId: 'mod-sigafat', version: '12.1.2190', description: 'Ajuste layout DANFE', appliedAt: '2026-08-02' },
  { id: 'p3', moduleId: 'mod-sigaest', version: '12.1.2180', description: 'Pacote de atualização de custo médio', appliedAt: '2026-06-03' },
  { id: 'p4', moduleId: 'mod-sigafin', version: '12.1.2210', description: 'Ajuste remessa CNAB 240 Bradesco', appliedAt: '2026-10-12' }
]

export const customizations: ProtheusCustomization[] = [
  {
    id: 'cz-psfat010',
    file: 'PSFAT010.prw',
    moduleId: 'mod-sigafat',
    description: 'Bloqueia faturamento de pedidos sem agendamento de container vinculado',
    author: 'Raissa Cogo',
    inProductionAt: '2025-11-04',
    changelog: [
      { id: 'cl1', version: '1.4', date: '2026-09-20', author: 'Raissa Cogo', description: 'Inclui validação de status do agendamento Procafe' },
      { id: 'cl2', version: '1.3', date: '2026-04-11', author: 'Raissa Cogo', description: 'Correção de bloqueio indevido em devolução' },
      { id: 'cl3', version: '1.0', date: '2025-11-04', author: 'Raissa Cogo', description: 'Versão inicial em produção' }
    ]
  },
  {
    id: 'cz-psest022',
    file: 'PSEST022.prw',
    moduleId: 'mod-sigaest',
    description: 'Rotina de reclassificação automática de saldo entre armazéns',
    author: 'Welison Mendonça',
    inProductionAt: '2026-01-15',
    changelog: [
      { id: 'cl4', version: '1.1', date: '2026-02-10', author: 'Welison Mendonça', description: 'Suporte a múltiplos armazéns de destino' },
      { id: 'cl5', version: '1.0', date: '2026-01-15', author: 'Welison Mendonça', description: 'Versão inicial em produção' }
    ]
  },
  {
    id: 'cz-psfin005',
    file: 'PSFIN005.prw',
    moduleId: 'mod-sigafin',
    description: 'Geração de boleto avulso com split de taxa Porto Seco',
    author: 'Raissa Cogo',
    inProductionAt: '2025-08-21',
    changelog: [
      { id: 'cl6', version: '2.0', date: '2026-05-02', author: 'Raissa Cogo', description: 'Migração para novo webservice do Bradesco' },
      { id: 'cl7', version: '1.0', date: '2025-08-21', author: 'Raissa Cogo', description: 'Versão inicial em produção' }
    ]
  }
]

export const knowledgeItems: ProtheusKnowledgeItem[] = [
  {
    id: 'kb-sc5',
    slug: 'sc5',
    type: 'TABLE',
    title: 'SC5 - Pedido de Venda',
    summary: 'Cabeçalho do pedido de venda, vinculado a SC6 (itens) e SA1 (cliente).',
    moduleId: 'mod-sigafat',
    relationships: 'SC5 1:N SC6 · SC5 N:1 SA1 · SC5 1:N SF2 (nota fiscal)',
    possibleValues: null,
    steps: [],
    fields: [
      { id: 'f1', name: 'C5_NUM', description: 'Número do pedido de venda' },
      { id: 'f2', name: 'C5_CLIENTE', description: 'Código do cliente (SA1)' },
      { id: 'f3', name: 'C5_LOJACLI', description: 'Loja do cliente' },
      { id: 'f4', name: 'C5_NOTA', description: 'Número da nota fiscal gerada' }
    ]
  },
  {
    id: 'kb-mv-nfenum',
    slug: 'mv_nfenum',
    type: 'PARAM',
    title: 'MV_NFENUM',
    summary: 'Define a numeração inicial de NF-e por filial.',
    moduleId: 'mod-sigafat',
    relationships: null,
    possibleValues: 'Número inteiro, 1 a 999999999',
    steps: [],
    fields: []
  },
  {
    id: 'kb-faq-boleto',
    slug: 'faq_boleto',
    type: 'FAQ',
    title: 'Como emitir um boleto avulso',
    summary: 'Passo a passo para emissão manual de boleto fora do fluxo de faturamento.',
    moduleId: 'mod-sigafin',
    relationships: null,
    possibleValues: null,
    steps: [
      'Acesse SIGAFIN > Atualizações > Contas a Receber > Boleto Avulso',
      'Informe cliente, loja e valor',
      'Selecione a carteira de cobrança Bradesco',
      'Confirme a geração e valide o PDF no preview',
      'Envie o boleto pelo botão "Enviar por e-mail"'
    ],
    fields: []
  }
]

export const jobs: ProtheusJob[] = [
  { id: 'job-nfe', name: 'JOB_NFE_ENVIO', description: 'Envio automático de NF-e para a SEFAZ', schedule: 'A cada 15 min', lastRunAt: '2026-10-28T08:45:00', nextRunAt: '2026-10-28T09:00:00', status: 'SUCCESS' },
  { id: 'job-boleto', name: 'JOB_BOLETO_REMESSA', description: 'Geração de remessa CNAB diária', schedule: 'Diário, 06:00', lastRunAt: '2026-10-28T06:00:00', nextRunAt: '2026-10-29T06:00:00', status: 'SUCCESS' },
  { id: 'job-estoque', name: 'JOB_RECLASS_ESTOQUE', description: 'Reclassificação de saldo entre armazéns', schedule: 'A cada 1 hora', lastRunAt: '2026-10-28T08:00:00', nextRunAt: '2026-10-28T09:00:00', status: 'FAILED' },
  { id: 'job-siscomex', name: 'JOB_SISCOMEX_SYNC', description: 'Sincronização de status de processos de importação', schedule: 'A cada 30 min', lastRunAt: '2026-10-28T08:30:00', nextRunAt: '2026-10-28T09:00:00', status: 'SUCCESS' }
]

export const integrations: ProtheusIntegration[] = [
  { id: 'int-siscomex', name: 'Siscomex', description: 'Processos de importação e exportação', status: 'OPERATIONAL', lastFailureAt: '2026-08-14' },
  { id: 'int-bradesco', name: 'Bradesco CNAB 240', description: 'Remessa/retorno de boletos e pagamentos', status: 'OPERATIONAL', lastFailureAt: null },
  { id: 'int-procafe', name: 'Procafe', description: 'Criação de ordem de serviço no agendamento de containers', status: 'UNSTABLE', lastFailureAt: '2026-10-27' },
  { id: 'int-sefaz', name: 'SEFAZ NF-e', description: 'Autorização e cancelamento de notas fiscais', status: 'FAILED', lastFailureAt: '2026-10-28' }
]

export const tickets: ProtheusTicket[] = [
  { id: 'tk-4821', number: '4821', title: 'NF-e rejeitada com motivo 539 em notas de devolução', category: 'FIX', target: 'TOTVS', status: 'WAITING_TOTVS', openedAt: '2026-10-20' },
  { id: 'tk-4822', number: '4822', title: 'Criar rotina de rateio de frete por item do pedido', category: 'IMPROVEMENT', target: 'CONSULTANCY', status: 'IN_PROGRESS', openedAt: '2026-10-18' },
  { id: 'tk-4809', number: '4809', title: 'Erro ao reclassificar saldo entre filiais com lote', category: 'FIX', target: 'CONSULTANCY', status: 'OPEN', openedAt: '2026-10-25' },
  { id: 'tk-4790', number: '4790', title: 'Integração Procafe: ordem de serviço duplicada', category: 'FIX', target: 'TOTVS', status: 'DONE', openedAt: '2026-09-30' }
]
