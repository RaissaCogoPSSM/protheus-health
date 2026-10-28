import { Module } from '@nestjs/common';
import { CustomizationsController } from '../controller/customizations.controller.js';
import { CustomizationsService } from '../service/customizations.service.js';

@Module({
  controllers: [CustomizationsController],
  providers: [CustomizationsService],
})
export class CustomizationsModule { }
