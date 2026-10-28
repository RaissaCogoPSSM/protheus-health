import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CustomizationsService } from './customizations.service.js';

@Controller('customizations')
export class CustomizationsController {
  constructor(private readonly customizationsService: CustomizationsService) {}

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
}
