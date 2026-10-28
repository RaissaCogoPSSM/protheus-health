import { Controller, Get, Post } from '@nestjs/common';
import { TphUpdatesService } from '../service/tph-updates.service.js';

@Controller('sync')
export class SyncController {
  constructor(private readonly tphUpdatesService: TphUpdatesService) {}

  @Post('updates')
  trigger() {
    return this.tphUpdatesService.trigger();
  }

  @Get('updates')
  status() {
    return this.tphUpdatesService.getState();
  }
}
