import { Module } from '@nestjs/common';
import { CustomizationsController } from './customizations.controller.js';
import { CustomizationsService } from './customizations.service.js';

@Module({
  controllers: [CustomizationsController],
  providers: [CustomizationsService],
})
export class CustomizationsModule {}
