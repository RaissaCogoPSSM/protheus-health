import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CreateIntegrationDto } from '../dto/integrations.dto.js';

@Injectable()
export class IntegrationsService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.protheusIntegration.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateIntegrationDto) {
    if (!dto.name?.trim()) throw new BadRequestException('Nome é obrigatório');
    if (!dto.description?.trim()) throw new BadRequestException('Descrição é obrigatória');

    const existing = await this.prisma.protheusIntegration.findUnique({ where: { name: dto.name.trim() } });
    if (existing) throw new BadRequestException(`Já existe uma integração com o nome ${dto.name.trim()}`);

    return this.prisma.protheusIntegration.create({
      data: {
        name: dto.name.trim(),
        description: dto.description.trim(),
        status: dto.status ?? 'OPERATIONAL',
        lastFailureAt: dto.lastFailureAt ? new Date(dto.lastFailureAt) : null,
      },
    });
  }
}
