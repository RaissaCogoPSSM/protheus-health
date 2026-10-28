import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'node:https';
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

export interface SyncProgress {
  phase: 'downloading' | 'processing';
  bytesReceived?: number;
  processed?: number;
  total?: number;
}

export interface SyncState {
  status: SyncStatus;
  startedAt?: string;
  finishedAt?: string;
  summary?: SyncSummary;
  error?: string;
  progress?: SyncProgress;
}

const IDLE_TIMEOUT_MS = 30_000;

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

  private updateProgress(progress: SyncProgress) {
    if (this.state.status === 'running') this.state = { ...this.state, progress };
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

    const trustServerCertificate = this.config.get<string>('TPH_TRUST_CERT') === 'true';
    this.logger.log(`Baixando TPH/updates de ${url}...`);
    const body = await this.request(url, headers, trustServerCertificate);
    this.logger.log(`Download concluído: ${body.length} bytes. Parseando JSON...`);
    const payload = JSON.parse(body) as TphUpdatesResponse;
    return payload.packagesApplied ?? [];
  }

  private request(url: string, headers: Record<string, string>, trustServerCertificate: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      const req = https.get(
        url,
        { headers, rejectUnauthorized: !trustServerCertificate },
        (res) => {
          if ((res.statusCode ?? 0) >= 400) {
            reject(new Error(`TPH/updates retornou ${res.statusCode} ${res.statusMessage}`));
            res.resume();
            return;
          }

          const chunks: Buffer[] = [];
          let bytesReceived = 0;
          let lastLogged = 0;

          res.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
            bytesReceived += chunk.length;
            this.updateProgress({ phase: 'downloading', bytesReceived });
            if (bytesReceived - lastLogged > 1_000_000) {
              lastLogged = bytesReceived;
              this.logger.log(`Recebidos ${(bytesReceived / 1_000_000).toFixed(1)} MB...`);
            }
          });
          res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
          res.on('error', reject);
        },
      );
      req.on('error', reject);

      // Aborta se ficar sem receber nenhum byte por IDLE_TIMEOUT_MS (host interno pode travar a conexão).
      req.setTimeout(IDLE_TIMEOUT_MS, () => {
        req.destroy(new Error(`TPH/updates sem resposta por ${IDLE_TIMEOUT_MS / 1000}s (conexão travada)`));
      });
    });
  }

  async sync(): Promise<SyncSummary> {
    const packages = await this.fetchPackages();
    const summary: SyncSummary = { fetched: packages.length, upserted: 0, skipped: 0, skippedReasons: [] };
    this.logger.log(`${packages.length} pacotes recebidos. Processando...`);

    for (let i = 0; i < packages.length; i++) {
      const item = packages[i];
      this.updateProgress({ phase: 'processing', processed: i, total: packages.length });

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

    this.updateProgress({ phase: 'processing', processed: packages.length, total: packages.length });
    this.logger.log(
      `Sync TPH/updates: ${summary.fetched} recebidos, ${summary.upserted} gravados, ${summary.skipped} ignorados`,
    );
    return summary;
  }
}
