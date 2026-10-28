import { Body, Controller, Get, Post } from '@nestjs/common';
import { IntegrationsService } from '../service/integrations.service.js';
import type { CreateIntegrationDto } from '../dto/integrations.dto.js';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) { }

  @Get()
  findAll() {
    return this.integrationsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateIntegrationDto) {
    return this.integrationsService.create(dto);
  }
}
