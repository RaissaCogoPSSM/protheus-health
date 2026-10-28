import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.protheusTicket.findMany({ orderBy: { openedAt: 'desc' } });
  }
}
