import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';


@Injectable()
export class IntegrationsService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.protheusIntegration.findMany({ orderBy: { name: 'asc' } });
  }
}
