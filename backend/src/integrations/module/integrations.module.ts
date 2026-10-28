import { Module } from '@nestjs/common';
import { IntegrationsService } from '../service/integrations.service.js';
import { IntegrationsController } from '../controller/integrations.controller.js';


@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
})
export class IntegrationsModule { }
