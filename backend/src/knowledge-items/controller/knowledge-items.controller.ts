import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import type { ProtheusKnowledgeType } from '@prisma/client';
import { KnowledgeItemsService } from '../service/knowledge-items.service.js';
import type { CreateFaqDto } from '../dto/knowledge-items.dto.js';

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

  @Post('faq')
  createFaq(@Body() dto: CreateFaqDto) {
    return this.knowledgeItemsService.createFaq(dto);
  }
}
