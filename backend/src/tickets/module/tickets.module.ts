import { Module } from '@nestjs/common';
import { TicketsController } from '../controller/tickets.controller.js';
import { TicketsService } from '../service/tickets.service.js';


@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule { }
