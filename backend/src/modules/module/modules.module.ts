import { Module } from '@nestjs/common';
import { ModulesController } from '../controller/modules.controller.js';
import { ModulesService } from '../service/modules.service.js';


@Module({
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule { }
