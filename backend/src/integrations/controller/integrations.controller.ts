import { Controller, Get } from '@nestjs/common';
import { IntegrationsService } from '../service/integrations.service.js';


@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) { }

  @Get()
  findAll() {
    return this.integrationsService.findAll();
  }
}
