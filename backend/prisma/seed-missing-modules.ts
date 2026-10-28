import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const modules: { code: string; name: string }[] = [
  { code: 'SIGAMDT', name: 'Medicina e Segurança do Trabalho' },
  { code: 'SIGAGPE', name: 'Gestão de Pessoal' },
  { code: 'TOTVS TSS', name: 'Totvs Service SOA' },
  { code: 'OUTROS', name: 'Outros' },
  { code: 'SIGAPCO', name: 'Planejamento e Controle Orçamentário' },
  { code: 'SIGAFIS', name: 'Livros Fiscais' },
  { code: 'SIGACTB', name: 'Contabilidade Gerencial' },
  { code: 'SIGACRM', name: 'CRM' },
  { code: 'SIGAATF', name: 'Ativo Fixo' },
  { code: 'SIGATAF', name: 'TOTVS Automação Fiscal' },
];

async function main() {
  for (const m of modules) {
    const result = await prisma.protheusModule.upsert({
      where: { code: m.code },
      create: { code: m.code, name: m.name },
      update: {},
    });
    console.log(`${m.code} => ${result.id}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
