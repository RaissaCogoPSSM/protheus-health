import { Module } from '@nestjs/common';
import { KnowledgeItemsController } from './knowledge-items.controller.js';
import { KnowledgeItemsService } from './knowledge-items.service.js';

@Module({
  controllers: [KnowledgeItemsController],
  providers: [KnowledgeItemsService],
})
export class KnowledgeItemsModule {}
