import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const modules = await Promise.all(
    [
      {
        code: 'SIGAFAT',
        name: 'Faturamento',
        description: 'Emissão de pedidos, NF-e e faturamento',
        status: 'UP_TO_DATE' as const,
        currentVersion: '12.1.2210',
        lastUpdateAt: new Date('2026-10-12'),
      },
      {
        code: 'SIGAEST',
        name: 'Estoque e Custos',
        description: 'Controle de estoque, custo médio e inventário',
        status: 'OUTDATED' as const,
        currentVersion: '12.1.2180',
        lastUpdateAt: new Date('2026-06-03'),
      },
      {
        code: 'SIGAFIN',
        name: 'Financeiro',
        description: 'Contas a pagar/receber, bancos e boletos',
        status: 'UP_TO_DATE' as const,
        currentVersion: '12.1.2210',
        lastUpdateAt: new Date('2026-10-12'),
      },
      {
        code: 'SIGAADV',
        name: 'Advanced Protheus',
        description: 'Scheduler, jobs e rotinas de automação',
        status: 'UP_TO_DATE' as const,
        currentVersion: '12.1.2210',
        lastUpdateAt: new Date('2026-10-12'),
      },
      {
        code: 'SIGACOM',
        name: 'Compras',
        description: 'Cotação, pedido de compra e importação',
        status: 'OUTDATED' as const,
        currentVersion: '12.1.2150',
        lastUpdateAt: new Date('2026-03-18'),
      },
    ].map((m) =>
      prisma.protheusModule.upsert({ where: { code: m.code }, create: m, update: m }),
    ),
  );

  const byCode = Object.fromEntries(modules.map((m) => [m.code, m]));

  await Promise.all(
    [
      { moduleCode: 'SIGAFAT', version: '12.1.2210', description: 'Correção NF-e rejeição 539', appliedAt: new Date('2026-10-12') },
      { moduleCode: 'SIGAFAT', version: '12.1.2190', description: 'Ajuste layout DANFE', appliedAt: new Date('2026-08-02') },
      { moduleCode: 'SIGAEST', version: '12.1.2180', description: 'Pacote de atualização de custo médio', appliedAt: new Date('2026-06-03') },
      { moduleCode: 'SIGAFIN', version: '12.1.2210', description: 'Ajuste remessa CNAB 240 Bradesco', appliedAt: new Date('2026-10-12') },
    ].map((p) =>
      prisma.protheusPatch.upsert({
        where: { moduleId_version: { moduleId: byCode[p.moduleCode].id, version: p.version } },
        create: { moduleId: byCode[p.moduleCode].id, version: p.version, description: p.description, appliedAt: p.appliedAt },
        update: { description: p.description, appliedAt: p.appliedAt },
      }),
    ),
  );

  const customizationsData = [
    {
      file: 'PSFAT010.prw',
      moduleCode: 'SIGAFAT',
      description: 'Bloqueia faturamento de pedidos sem agendamento de container vinculado',
      author: 'Raissa Cogo',
      inProductionAt: new Date('2025-11-04'),
      changelog: [
        { version: '1.4', date: new Date('2026-09-20'), author: 'Raissa Cogo', description: 'Inclui validação de status do agendamento Procafe' },
        { version: '1.3', date: new Date('2026-04-11'), author: 'Raissa Cogo', description: 'Correção de bloqueio indevido em devolução' },
        { version: '1.0', date: new Date('2025-11-04'), author: 'Raissa Cogo', description: 'Versão inicial em produção' },
      ],
    },
    {
      file: 'PSEST022.prw',
      moduleCode: 'SIGAEST',
      description: 'Rotina de reclassificação automática de saldo entre armazéns',
      author: 'Raissa Cogo',
      inProductionAt: new Date('2026-01-15'),
      changelog: [
        { version: '1.1', date: new Date('2026-02-10'), author: 'Raissa Cogo', description: 'Suporte a múltiplos armazéns de destino' },
        { version: '1.0', date: new Date('2026-01-15'), author: 'Raissa Cogo', description: 'Versão inicial em produção' },
      ],
    },
    {
      file: 'PSFIN005.prw',
      moduleCode: 'SIGAFIN',
      description: 'Geração de boleto avulso com split de taxa Porto Seco',
      author: 'Raissa Cogo',
      inProductionAt: new Date('2025-08-21'),
      changelog: [
        { version: '2.0', date: new Date('2026-05-02'), author: 'Raissa Cogo', description: 'Migração para novo webservice do Bradesco' },
        { version: '1.0', date: new Date('2025-08-21'), author: 'Raissa Cogo', description: 'Versão inicial em produção' },
      ],
    },
  ];

  for (const c of customizationsData) {
    const customization = await prisma.protheusCustomization.upsert({
      where: { file: c.file },
      create: {
        file: c.file,
        moduleId: byCode[c.moduleCode].id,
        description: c.description,
        author: c.author,
        inProductionAt: c.inProductionAt,
      },
      update: {
        moduleId: byCode[c.moduleCode].id,
        description: c.description,
        author: c.author,
        inProductionAt: c.inProductionAt,
      },
    });

    await prisma.protheusCustomizationChangelog.deleteMany({ where: { customizationId: customization.id } });
    await prisma.protheusCustomizationChangelog.createMany({
      data: c.changelog.map((entry) => ({ ...entry, customizationId: customization.id })),
    });
  }

  const knowledgeItemsData = [
    {
      slug: 'sc5',
      type: 'TABLE' as const,
      title: 'SC5 - Pedido de Venda',
      summary: 'Cabeçalho do pedido de venda, vinculado a SC6 (itens) e SA1 (cliente).',
      moduleCode: 'SIGAFAT',
      relationships: 'SC5 1:N SC6 · SC5 N:1 SA1 · SC5 1:N SF2 (nota fiscal)',
      possibleValues: null,
      steps: [] as string[],
      fields: [
        { name: 'C5_NUM', description: 'Número do pedido de venda' },
        { name: 'C5_CLIENTE', description: 'Código do cliente (SA1)' },
        { name: 'C5_LOJACLI', description: 'Loja do cliente' },
        { name: 'C5_NOTA', description: 'Número da nota fiscal gerada' },
      ],
    },
    {
      slug: 'mv_nfenum',
      type: 'PARAM' as const,
      title: 'MV_NFENUM',
      summary: 'Define a numeração inicial de NF-e por filial.',
      moduleCode: 'SIGAFAT',
      relationships: null,
      possibleValues: 'Número inteiro, 1 a 999999999',
      steps: [] as string[],
      fields: [] as { name: string; description: string }[],
    },
    {
      slug: 'faq_boleto',
      type: 'FAQ' as const,
      title: 'Como emitir um boleto avulso',
      summary: 'Passo a passo para emissão manual de boleto fora do fluxo de faturamento.',
      moduleCode: 'SIGAFIN',
      relationships: null,
      possibleValues: null,
      steps: [
        'Acesse SIGAFIN > Atualizações > Contas a Receber > Boleto Avulso',
        'Informe cliente, loja e valor',
        'Selecione a carteira de cobrança Bradesco',
        'Confirme a geração e valide o PDF no preview',
        'Envie o boleto pelo botão "Enviar por e-mail"',
      ],
      fields: [] as { name: string; description: string }[],
    },
  ];

  for (const k of knowledgeItemsData) {
    const item = await prisma.protheusKnowledgeItem.upsert({
      where: { slug: k.slug },
      create: {
        slug: k.slug,
        type: k.type,
        title: k.title,
        summary: k.summary,
        moduleId: byCode[k.moduleCode].id,
        relationships: k.relationships,
        possibleValues: k.possibleValues,
        steps: k.steps,
      },
      update: {
        type: k.type,
        title: k.title,
        summary: k.summary,
        moduleId: byCode[k.moduleCode].id,
        relationships: k.relationships,
        possibleValues: k.possibleValues,
        steps: k.steps,
      },
    });

    if (k.fields.length) {
      await prisma.protheusKnowledgeField.deleteMany({ where: { itemId: item.id } });
      await prisma.protheusKnowledgeField.createMany({
        data: k.fields.map((f, position) => ({ ...f, itemId: item.id, position })),
      });
    }
  }

  await Promise.all(
    [
      { name: 'JOB_NFE_ENVIO', description: 'Envio automático de NF-e para a SEFAZ', schedule: 'A cada 15 min', lastRunAt: new Date('2026-10-28T08:45:00'), nextRunAt: new Date('2026-10-28T09:00:00'), status: 'SUCCESS' as const },
      { name: 'JOB_BOLETO_REMESSA', description: 'Geração de remessa CNAB diária', schedule: 'Diário, 06:00', lastRunAt: new Date('2026-10-28T06:00:00'), nextRunAt: new Date('2026-10-29T06:00:00'), status: 'SUCCESS' as const },
      { name: 'JOB_RECLASS_ESTOQUE', description: 'Reclassificação de saldo entre armazéns', schedule: 'A cada 1 hora', lastRunAt: new Date('2026-10-28T08:00:00'), nextRunAt: new Date('2026-10-28T09:00:00'), status: 'FAILED' as const },
      { name: 'JOB_SISCOMEX_SYNC', description: 'Sincronização de status de processos de importação', schedule: 'A cada 30 min', lastRunAt: new Date('2026-10-28T08:30:00'), nextRunAt: new Date('2026-10-28T09:00:00'), status: 'SUCCESS' as const },
    ].map((j) => prisma.protheusJob.upsert({ where: { name: j.name }, create: j, update: j })),
  );

  await Promise.all(
    [
      { name: 'Siscomex', description: 'Processos de importação e exportação', status: 'OPERATIONAL' as const, lastFailureAt: new Date('2026-08-14') },
      { name: 'Bradesco CNAB 240', description: 'Remessa/retorno de boletos e pagamentos', status: 'OPERATIONAL' as const, lastFailureAt: null },
      { name: 'Procafe', description: 'Criação de ordem de serviço no agendamento de containers', status: 'UNSTABLE' as const, lastFailureAt: new Date('2026-10-27') },
      { name: 'SEFAZ NF-e', description: 'Autorização e cancelamento de notas fiscais', status: 'FAILED' as const, lastFailureAt: new Date('2026-10-28') },
    ].map((i) => prisma.protheusIntegration.upsert({ where: { name: i.name }, create: i, update: i })),
  );

  await Promise.all(
    [
      { number: '4821', title: 'NF-e rejeitada com motivo 539 em notas de devolução', category: 'FIX' as const, target: 'TOTVS' as const, status: 'WAITING_TOTVS' as const, openedAt: new Date('2026-10-20') },
      { number: '4822', title: 'Criar rotina de rateio de frete por item do pedido', category: 'IMPROVEMENT' as const, target: 'CONSULTANCY' as const, status: 'IN_PROGRESS' as const, openedAt: new Date('2026-10-18') },
      { number: '4809', title: 'Erro ao reclassificar saldo entre filiais com lote', category: 'FIX' as const, target: 'CONSULTANCY' as const, status: 'OPEN' as const, openedAt: new Date('2026-10-25') },
      { number: '4790', title: 'Integração Procafe: ordem de serviço duplicada', category: 'FIX' as const, target: 'TOTVS' as const, status: 'DONE' as const, openedAt: new Date('2026-09-30') },
    ].map((t) => prisma.protheusTicket.upsert({ where: { number: t.number }, create: t, update: t })),
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
