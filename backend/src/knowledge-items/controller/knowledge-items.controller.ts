import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import type { ProtheusKnowledgeType } from '@prisma/client';
import { KnowledgeItemsService } from '../service/knowledge-items.service.js';


@Controller('knowledge-items')
export class KnowledgeItemsController {
  constructor(private readonly knowledgeItemsService: KnowledgeItemsService) {}

  @Get()
  findAll(@Query('type') type?: ProtheusKnowledgeType) {
    return this.knowledgeItemsService.findAll(type);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.knowledgeItemsService.findOne(id);
    if (!item) throw new NotFoundException('Item não encontrado');
    return item;
  }
}
