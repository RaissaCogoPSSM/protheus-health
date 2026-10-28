import { Module } from '@nestjs/common';
import { JobsService } from '../service/jobs.service.js';
import { JobsController } from '../controller/jobs.controller.js';


@Module({
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule { }
