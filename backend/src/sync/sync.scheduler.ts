import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TphUpdatesService } from './tph-updates.service.js';

@Injectable()
export class SyncScheduler implements OnModuleInit {
  private readonly logger = new Logger(SyncScheduler.name);

  constructor(
    private readonly tphUpdatesService: TphUpdatesService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    const cronExpression = this.config.get<string>('TPH_SYNC_CRON') ?? '0 0 * * * *';

    const job = new CronJob(cronExpression, async () => {
      try {
        await this.tphUpdatesService.sync();
      } catch (error) {
        this.logger.error('Falha ao sincronizar TPH/updates', error as Error);
      }
    });

    this.schedulerRegistry.addCronJob('tph-updates-sync', job);
    job.start();
    this.logger.log(`Sync TPH/updates agendado com cron "${cronExpression}"`);
  }
}
