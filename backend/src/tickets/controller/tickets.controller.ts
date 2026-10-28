import { Controller, Get } from '@nestjs/common';
import { TicketsService } from '../service/tickets.service.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }
}
