import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncController } from './sync.controller.js';
import { TphUpdatesService } from './tph-updates.service.js';
import { SyncScheduler } from './sync.scheduler.js';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [SyncController],
  providers: [TphUpdatesService, SyncScheduler],
})
export class SyncModule {}
