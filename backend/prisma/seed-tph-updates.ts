import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import { mapTphPackage, type TphPackage } from '../src/sync/service/tph-updates.mapper.js';

interface TphUpdatesResponse {
  packagesApplied?: TphPackage[];
}

const prisma = new PrismaClient();

function loadPackages(filePath: string): TphPackage[] {
  let raw = readFileSync(filePath, 'utf8');
  // O export do TPH às vezes vem com vírgula sobrando antes de `}`/`]` (JSON inválido) — corrige antes de parsear.
  raw = raw.replace(/,(\s*[}\]])/g, '$1');

  const payload = JSON.parse(raw) as TphUpdatesResponse;
  return payload.packagesApplied ?? [];
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Uso: tsx prisma/seed-tph-updates.ts <caminho-do-json>');
    process.exit(1);
  }

  const packages = loadPackages(filePath);
  console.log(`${packages.length} pacotes encontrados em ${filePath}`);

  const summary = { upserted: 0, skipped: 0, skippedReasons: [] as string[] };

  for (const item of packages) {
    const normalized = mapTphPackage(item);
    if (!normalized) {
      summary.skipped++;
      summary.skippedReasons.push(`Registro sem patchid/module/data válidos (patchid: ${item.patchid ?? '—'})`);
      continue;
    }

    const module = await prisma.protheusModule.findUnique({ where: { code: normalized.moduleCode } });
    if (!module) {
      summary.skipped++;
      summary.skippedReasons.push(`Módulo ${normalized.moduleCode} não cadastrado`);
      continue;
    }

    await prisma.protheusPatch.upsert({
      where: { moduleId_version: { moduleId: module.id, version: normalized.version } },
      create: {
        moduleId: module.id,
        version: normalized.version,
        description: normalized.description,
        appliedAt: normalized.appliedAt,
      },
      update: {
        description: normalized.description,
        appliedAt: normalized.appliedAt,
      },
    });

    const isNewer = !module.lastUpdateAt || normalized.appliedAt > module.lastUpdateAt;
    if (isNewer) {
      await prisma.protheusModule.update({
        where: { id: module.id },
        data: {
          lastUpdateAt: normalized.appliedAt,
          ...(normalized.productVersion ? { currentVersion: normalized.productVersion } : {}),
        },
      });
    }

    summary.upserted++;
  }

  console.log(`Concluído: ${summary.upserted} gravados, ${summary.skipped} ignorados`);
  if (summary.skippedReasons.length) {
    console.log('Motivos dos ignorados:');
    for (const reason of summary.skippedReasons) console.log(`  - ${reason}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
