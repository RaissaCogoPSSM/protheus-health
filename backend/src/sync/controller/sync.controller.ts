import { Controller, Post } from '@nestjs/common';
import { TphUpdatesService } from '../service/tph-updates.service.js';


@Controller('sync')
export class SyncController {
  constructor(private readonly tphUpdatesService: TphUpdatesService) {}

  @Post('updates')
  trigger() {
    return this.tphUpdatesService.sync();
  }
}
