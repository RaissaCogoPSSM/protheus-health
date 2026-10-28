import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ProtheusKnowledgeType } from '@prisma/client';

@Injectable()
export class KnowledgeItemsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(type?: ProtheusKnowledgeType) {
    return this.prisma.protheusKnowledgeItem.findMany({
      where: type ? { type } : undefined,
      include: { fields: { orderBy: { position: 'asc' } } },
      orderBy: { title: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.protheusKnowledgeItem.findUnique({
      where: { id },
      include: { fields: { orderBy: { position: 'asc' } } },
    });
  }
}
