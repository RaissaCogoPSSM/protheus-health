import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';


@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.protheusJob.findMany({ orderBy: { name: 'asc' } });
  }
}
