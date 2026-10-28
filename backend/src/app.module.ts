import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ModulesModule } from './modules/modules.module.js';
import { CustomizationsModule } from './customizations/customizations.module.js';
import { KnowledgeItemsModule } from './knowledge-items/knowledge-items.module.js';
import { JobsModule } from './jobs/jobs.module.js';
import { IntegrationsModule } from './integrations/integrations.module.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { SyncModule } from './sync/sync.module.js';

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
export class AppModule {}
