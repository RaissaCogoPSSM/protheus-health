import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.protheusModule.findMany({ orderBy: { code: 'asc' } });
  }

  findOne(id: string) {
    return this.prisma.protheusModule.findUnique({
      where: { id },
      include: {
        patches: { orderBy: { appliedAt: 'desc' } },
        customizations: { orderBy: { file: 'asc' } },
      },
    });
  }
}
