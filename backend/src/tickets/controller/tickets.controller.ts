import { Body, Controller, Get, Post } from '@nestjs/common';
import { TicketsService } from '../service/tickets.service.js';
import type { CreateTicketDto } from '../dto/tickets.dto.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto);
  }
}
