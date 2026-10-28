import { Module } from '@nestjs/common';

import { SyncController } from '../controller/sync.controller.js';
import { TphUpdatesService } from '../service/tph-updates.service.js';

@Module({
  controllers: [SyncController],
  providers: [TphUpdatesService],
})
export class SyncModule {}
