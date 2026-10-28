import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ModulesModule } from './modules/module/modules.module.js';
import { CustomizationsModule } from './customizations/module/customizations.module.js';
import { KnowledgeItemsModule } from './knowledge-items/module/knowledge-items.module.js';
import { JobsModule } from './jobs/module/jobs.module.js';
import { IntegrationsModule } from './integrations/module/integrations.module.js';
import { TicketsModule } from './tickets/module/tickets.module.js';
import { SyncModule } from './sync/module/sync.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ModulesModule,
    CustomizationsModule,
    KnowledgeItemsModule,
    JobsModule,
    IntegrationsModule,
    TicketsModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
