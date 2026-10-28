import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';


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
}
