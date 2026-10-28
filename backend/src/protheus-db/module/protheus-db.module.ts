import { Module } from '@nestjs/common';
import { ProtheusDbService } from '../service/protheus-db.service.js';

@Module({
  providers: [ProtheusDbService],
  exports: [ProtheusDbService],
})
export class ProtheusDbModule {}
