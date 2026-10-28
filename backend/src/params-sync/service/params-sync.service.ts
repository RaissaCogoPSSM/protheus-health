import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ProtheusDbService } from '../../protheus-db/service/protheus-db.service.js';

export interface ParamsSyncSummary {
  fetched: number;
  upserted: number;
  skipped: number;
  skippedReasons: string[];
}

export type SyncStatus = 'idle' | 'running' | 'done' | 'error';

export interface SyncState {
  status: SyncStatus;
  startedAt?: string;
  finishedAt?: string;
  summary?: ParamsSyncSummary;
  error?: string;
}

function slugify(parametro: string, filial: string) {
  const branch = filial.trim() || 'default';
  return `${parametro.trim().toLowerCase()}-${branch.toLowerCase()}`;
}

@Injectable()
export class ParamsSyncService {
  private readonly logger = new Logger(ParamsSyncService.name);
  private state: SyncState = { status: 'idle' };

  constructor(
    private readonly protheusDb: ProtheusDbService,
    private readonly prisma: PrismaService,
  ) {}

  getState(): SyncState {
    return this.state;
  }

  trigger(): SyncState {
    if (this.state.status === 'running') return this.state;

    this.state = { status: 'running', startedAt: new Date().toISOString() };
    this.runInBackground();
    return this.state;
  }

  // Sincronização automática diária, à meia-noite, para manter os
  // parâmetros em dia depois da carga inicial.
  @Cron('0 0 0 * * *')
  handleDailySync() {
    this.logger.log('Disparando sincronização diária de parâmetros (SX6010)');
    this.trigger();
  }

  private runInBackground() {
    const startedAt = this.state.startedAt;
    this.sync()
      .then((summary) => {
        this.state = { status: 'done', startedAt, finishedAt: new Date().toISOString(), summary };
      })
      .catch((error: Error) => {
        this.logger.error('Falha ao sincronizar parâmetros (SX6010)', error);
        this.state = { status: 'error', startedAt, finishedAt: new Date().toISOString(), error: error.message };
      });
  }

  async sync(): Promise<ParamsSyncSummary> {
    const rows = await this.protheusDb.getParameters();
    const summary: ParamsSyncSummary = { fetched: rows.length, upserted: 0, skipped: 0, skippedReasons: [] };

    for (const row of rows) {
      const parametro = row.PARAMETRO?.trim();
      if (!parametro) {
        summary.skipped++;
        summary.skippedReasons.push('Registro sem PARAMETRO (X6_VAR)');
        continue;
      }

      const slug = slugify(parametro, row.FILIAL ?? '');
      const summaryText = row.DESCRICAO?.trim() || parametro;

      await this.prisma.protheusKnowledgeItem.upsert({
        where: { slug },
        create: {
          slug,
          type: 'PARAM',
          title: parametro,
          summary: summaryText,
          possibleValues: row.CONTEUDO ?? '',
          branch: row.FILIAL ?? null,
        },
        update: {
          summary: summaryText,
          possibleValues: row.CONTEUDO ?? '',
          branch: row.FILIAL ?? null,
        },
      });

      summary.upserted++;
    }

    this.logger.log(
      `Sync parâmetros (SX6010): ${summary.fetched} recebidos, ${summary.upserted} gravados, ${summary.skipped} ignorados`,
    );
    return summary;
  }
}
