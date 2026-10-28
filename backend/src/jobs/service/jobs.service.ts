import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CreateJobDto } from '../dto/jobs.dto.js';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.protheusJob.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateJobDto) {
    if (!dto.name?.trim()) throw new BadRequestException('Nome é obrigatório');
    if (!dto.description?.trim()) throw new BadRequestException('Descrição é obrigatória');
    if (!dto.schedule?.trim()) throw new BadRequestException('Agendamento é obrigatório');

    const existing = await this.prisma.protheusJob.findUnique({ where: { name: dto.name.trim() } });
    if (existing) throw new BadRequestException(`Já existe um job com o nome ${dto.name.trim()}`);

    return this.prisma.protheusJob.create({
      data: {
        name: dto.name.trim(),
        description: dto.description.trim(),
        schedule: dto.schedule.trim(),
        status: dto.status ?? 'SUCCESS',
        lastRunAt: dto.lastRunAt ? new Date(dto.lastRunAt) : null,
        nextRunAt: dto.nextRunAt ? new Date(dto.nextRunAt) : null,
      },
    });
  }
}
