import { Body, Controller, Get, Post } from '@nestjs/common';
import { JobsService } from '../service/jobs.service.js';
import type { CreateJobDto } from '../dto/jobs.dto.js';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateJobDto) {
    return this.jobsService.create(dto);
  }
}
