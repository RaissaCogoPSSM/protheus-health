import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ModulesService } from './modules.service.js';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const module = await this.modulesService.findOne(id);
    if (!module) throw new NotFoundException('Módulo não encontrado');
    return module;
  }
}
