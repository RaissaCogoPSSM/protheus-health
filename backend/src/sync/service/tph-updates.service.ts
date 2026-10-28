import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mapTphPackage, TphPackage } from './tph-updates.mapper.js';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface SyncSummary {
  fetched: number;
  upserted: number;
  skipped: number;
  skippedReasons: string[];
}

interface TphUpdatesResponse {
  packagesApplied?: TphPackage[];
}

export type SyncStatus = 'idle' | 'running' | 'done' | 'error';

export interface SyncState {
  status: SyncStatus;
  startedAt?: string;
  finishedAt?: string;
  summary?: SyncSummary;
  error?: string;
}

@Injectable()
export class TphUpdatesService {
  private readonly logger = new Logger(TphUpdatesService.name);
  private state: SyncState = { status: 'idle' };

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
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

  private runInBackground() {
    const startedAt = this.state.startedAt;
    this.sync()
      .then((summary) => {
        this.state = { status: 'done', startedAt, finishedAt: new Date().toISOString(), summary };
      })
      .catch((error: Error) => {
        this.logger.error('Falha ao sincronizar TPH/updates', error);
        this.state = { status: 'error', startedAt, finishedAt: new Date().toISOString(), error: error.message };
      });
  }

  private async fetchPackages(): Promise<TphPackage[]> {
    const url = this.config.get<string>('TPH_UPDATES_URL');
    if (!url) throw new Error('TPH_UPDATES_URL não configurada');

    const username = this.config.get<string>('TPH_USERNAME') ?? '';
    const password = this.config.get<string>('TPH_PASSWORD') ?? '';

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (username || password) {
      headers.Authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`TPH/updates retornou ${response.status} ${response.statusText}`);
    }

    const payload = (await response.json()) as TphUpdatesResponse;
    return payload.packagesApplied ?? [];
  }

  async sync(): Promise<SyncSummary> {
    const packages = await this.fetchPackages();
    const summary: SyncSummary = { fetched: packages.length, upserted: 0, skipped: 0, skippedReasons: [] };

    for (const item of packages) {
      const normalized = mapTphPackage(item);
      if (!normalized) {
        summary.skipped++;
        summary.skippedReasons.push(`Registro sem patchid/module/data válidos (patchid: ${item.patchid ?? '—'})`);
        continue;
      }

      const module = await this.prisma.protheusModule.findUnique({
        where: { code: normalized.moduleCode },
      });
      if (!module) {
        summary.skipped++;
        summary.skippedReasons.push(`Módulo ${normalized.moduleCode} não cadastrado`);
        continue;
      }

      await this.prisma.protheusPatch.upsert({
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
        await this.prisma.protheusModule.update({
          where: { id: module.id },
          data: {
            lastUpdateAt: normalized.appliedAt,
            ...(normalized.productVersion ? { currentVersion: normalized.productVersion } : {}),
          },
        });
      }

      summary.upserted++;
    }

    this.logger.log(
      `Sync TPH/updates: ${summary.fetched} recebidos, ${summary.upserted} gravados, ${summary.skipped} ignorados`,
    );
    return summary;
  }
}
