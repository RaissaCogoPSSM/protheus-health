import { BadRequestException, Injectable } from '@nestjs/common';
import type { ProtheusKnowledgeType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CreateFaqDto } from '../dto/knowledge-items.dto.js';

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

  async createFaq(dto: CreateFaqDto) {
    if (!dto.slug?.trim()) throw new BadRequestException('Slug é obrigatório');
    if (!dto.title?.trim()) throw new BadRequestException('Título é obrigatório');
    if (!dto.summary?.trim()) throw new BadRequestException('Resumo é obrigatório');

    const steps = (dto.steps ?? []).map((s) => s.trim()).filter(Boolean);
    if (!steps.length) throw new BadRequestException('Informe ao menos um passo');

    const existing = await this.prisma.protheusKnowledgeItem.findUnique({ where: { slug: dto.slug.trim() } });
    if (existing) throw new BadRequestException(`Já existe um item com o slug ${dto.slug.trim()}`);

    if (dto.moduleId) {
      const module = await this.prisma.protheusModule.findUnique({ where: { id: dto.moduleId } });
      if (!module) throw new BadRequestException('Módulo informado não existe');
    }

    return this.prisma.protheusKnowledgeItem.create({
      data: {
        slug: dto.slug.trim(),
        type: 'FAQ',
        title: dto.title.trim(),
        summary: dto.summary.trim(),
        moduleId: dto.moduleId || null,
        steps,
      },
      include: { fields: { orderBy: { position: 'asc' } } },
    });
  }
}
