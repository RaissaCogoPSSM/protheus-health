import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CreateTicketDto } from '../dto/tickets.dto.js';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.protheusTicket.findMany({ orderBy: { openedAt: 'desc' } });
  }

  async create(dto: CreateTicketDto) {
    if (!dto.number?.trim()) throw new BadRequestException('Número é obrigatório');
    if (!dto.title?.trim()) throw new BadRequestException('Assunto é obrigatório');
    if (!dto.category) throw new BadRequestException('Categoria é obrigatória');
    if (!dto.target) throw new BadRequestException('Destino é obrigatório');

    const existing = await this.prisma.protheusTicket.findUnique({ where: { number: dto.number.trim() } });
    if (existing) throw new BadRequestException(`Já existe um chamado com o número ${dto.number.trim()}`);

    return this.prisma.protheusTicket.create({
      data: {
        number: dto.number.trim(),
        title: dto.title.trim(),
        category: dto.category,
        target: dto.target,
        status: dto.status ?? 'OPEN',
        openedAt: dto.openedAt ? new Date(dto.openedAt) : new Date(),
      },
    });
  }
}
