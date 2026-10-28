import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { CustomizationsService } from '../service/customizations.service.js';
import type { CreateChangelogDto, CreateCustomizationDto } from '../dto/customizations.dto.js';

@Controller('customizations')
export class CustomizationsController {
  constructor(private readonly customizationsService: CustomizationsService) { }

  @Get()
  findAll() {
    return this.customizationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customization = await this.customizationsService.findOne(id);
    if (!customization) throw new NotFoundException('Customização não encontrada');
    return customization;
  }

  @Post()
  create(@Body() dto: CreateCustomizationDto) {
    return this.customizationsService.create(dto);
  }

  @Post(':id/changelog')
  addChangelogEntry(@Param('id') id: string, @Body() dto: CreateChangelogDto) {
    return this.customizationsService.addChangelogEntry(id, dto);
  }
}
