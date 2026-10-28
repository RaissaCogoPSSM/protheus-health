import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CreateChangelogDto, CreateCustomizationDto } from '../dto/customizations.dto.js';

@Injectable()
export class CustomizationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.protheusCustomization.findMany({
      include: { changelog: { orderBy: { date: 'desc' } } },
      orderBy: { file: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.protheusCustomization.findUnique({
      where: { id },
      include: { changelog: { orderBy: { date: 'desc' } } },
    });
  }

  async create(dto: CreateCustomizationDto) {
    if (!dto.file?.trim()) throw new BadRequestException('Arquivo é obrigatório');
    if (!dto.moduleId?.trim()) throw new BadRequestException('Módulo é obrigatório');
    if (!dto.description?.trim()) throw new BadRequestException('Descrição é obrigatória');

    const module = await this.prisma.protheusModule.findUnique({ where: { id: dto.moduleId } });
    if (!module) throw new BadRequestException('Módulo informado não existe');

    const existing = await this.prisma.protheusCustomization.findUnique({ where: { file: dto.file.trim() } });
    if (existing) throw new BadRequestException(`Já existe uma customização para o arquivo ${dto.file.trim()}`);

    return this.prisma.protheusCustomization.create({
      data: {
        file: dto.file.trim(),
        moduleId: dto.moduleId,
        description: dto.description.trim(),
        author: dto.author?.trim() || null,
        inProductionAt: dto.inProductionAt ? new Date(dto.inProductionAt) : null,
      },
      include: { changelog: { orderBy: { date: 'desc' } } },
    });
  }

  async addChangelogEntry(customizationId: string, dto: CreateChangelogDto) {
    if (!dto.version?.trim()) throw new BadRequestException('Versão é obrigatória');
    if (!dto.date?.trim()) throw new BadRequestException('Data é obrigatória');
    if (!dto.description?.trim()) throw new BadRequestException('Descrição é obrigatória');

    const date = new Date(dto.date);
    if (Number.isNaN(date.getTime())) throw new BadRequestException('Data inválida');

    const customization = await this.prisma.protheusCustomization.findUnique({ where: { id: customizationId } });
    if (!customization) throw new NotFoundException('Customização não encontrada');

    await this.prisma.protheusCustomizationChangelog.create({
      data: {
        customizationId,
        version: dto.version.trim(),
        date,
        author: dto.author?.trim() || null,
        description: dto.description.trim(),
      },
    });

    return this.findOne(customizationId);
  }
}
