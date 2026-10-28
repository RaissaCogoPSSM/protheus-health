import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { SyncScheduler } from '../service/sync.scheduler.js';
import { SyncController } from '../controller/sync.controller.js';
import { TphUpdatesService } from '../service/tph-updates.service.js';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [SyncController],
  providers: [TphUpdatesService, SyncScheduler],
})
export class SyncModule { }
