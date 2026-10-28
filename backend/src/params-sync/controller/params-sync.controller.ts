import { Controller, Get, Post } from '@nestjs/common';
import { ParamsSyncService } from '../service/params-sync.service.js';

@Controller('sync')
export class ParamsSyncController {
  constructor(private readonly paramsSyncService: ParamsSyncService) {}

  @Post('params')
  trigger() {
    return this.paramsSyncService.trigger();
  }

  @Get('params')
  status() {
    return this.paramsSyncService.getState();
  }
}
