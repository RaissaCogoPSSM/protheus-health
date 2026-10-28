import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ProtheusDbModule } from '../../protheus-db/module/protheus-db.module.js';
import { ParamsSyncController } from '../controller/params-sync.controller.js';
import { ParamsSyncService } from '../service/params-sync.service.js';

@Module({
  imports: [ScheduleModule.forRoot(), ProtheusDbModule],
  controllers: [ParamsSyncController],
  providers: [ParamsSyncService],
})
export class ParamsSyncModule {}
