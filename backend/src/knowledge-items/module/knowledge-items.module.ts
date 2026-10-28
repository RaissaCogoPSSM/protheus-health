import { Module } from '@nestjs/common';
import { KnowledgeItemsController } from '../controller/knowledge-items.controller.js';
import { KnowledgeItemsService } from '../service/knowledge-items.service.js';

@Module({
  controllers: [KnowledgeItemsController],
  providers: [KnowledgeItemsService],
})
export class KnowledgeItemsModule { }
