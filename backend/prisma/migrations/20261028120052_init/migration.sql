-- CreateEnum
CREATE TYPE "ProtheusModuleStatus" AS ENUM ('UP_TO_DATE', 'OUTDATED');

-- CreateEnum
CREATE TYPE "ProtheusKnowledgeType" AS ENUM ('TABLE', 'PARAM', 'FAQ');

-- CreateEnum
CREATE TYPE "ProtheusJobStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "ProtheusIntegrationStatus" AS ENUM ('OPERATIONAL', 'UNSTABLE', 'FAILED');

-- CreateEnum
CREATE TYPE "ProtheusTicketCategory" AS ENUM ('FIX', 'IMPROVEMENT');

-- CreateEnum
CREATE TYPE "ProtheusTicketTarget" AS ENUM ('TOTVS', 'CONSULTANCY');

-- CreateEnum
CREATE TYPE "ProtheusTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_TOTVS', 'DONE');

-- CreateTable
CREATE TABLE "protheus_modules" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProtheusModuleStatus" NOT NULL DEFAULT 'UP_TO_DATE',
    "currentVersion" TEXT,
    "lastUpdateAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protheus_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protheus_patches" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "protheus_patches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protheus_customizations" (
    "id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author" TEXT,
    "inProductionAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protheus_customizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protheus_customization_changelog" (
    "id" TEXT NOT NULL,
    "customizationId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "author" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "protheus_customization_changelog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protheus_knowledge_items" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ProtheusKnowledgeType" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "moduleId" TEXT,
    "relationships" TEXT,
    "possibleValues" TEXT,
    "steps" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protheus_knowledge_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protheus_knowledge_fields" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "protheus_knowledge_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protheus_jobs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "status" "ProtheusJobStatus" NOT NULL DEFAULT 'SUCCESS',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protheus_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protheus_integrations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ProtheusIntegrationStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "lastFailureAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protheus_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protheus_tickets" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ProtheusTicketCategory" NOT NULL,
    "target" "ProtheusTicketTarget" NOT NULL,
    "status" "ProtheusTicketStatus" NOT NULL DEFAULT 'OPEN',
    "openedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protheus_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "protheus_modules_code_key" ON "protheus_modules"("code");

-- CreateIndex
CREATE INDEX "protheus_patches_moduleId_appliedAt_idx" ON "protheus_patches"("moduleId", "appliedAt");

-- CreateIndex
CREATE UNIQUE INDEX "protheus_patches_moduleId_version_key" ON "protheus_patches"("moduleId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "protheus_customizations_file_key" ON "protheus_customizations"("file");

-- CreateIndex
CREATE INDEX "protheus_customizations_moduleId_idx" ON "protheus_customizations"("moduleId");

-- CreateIndex
CREATE INDEX "protheus_customization_changelog_customizationId_date_idx" ON "protheus_customization_changelog"("customizationId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "protheus_knowledge_items_slug_key" ON "protheus_knowledge_items"("slug");

-- CreateIndex
CREATE INDEX "protheus_knowledge_items_type_idx" ON "protheus_knowledge_items"("type");

-- CreateIndex
CREATE INDEX "protheus_knowledge_items_moduleId_idx" ON "protheus_knowledge_items"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "protheus_knowledge_fields_itemId_name_key" ON "protheus_knowledge_fields"("itemId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "protheus_jobs_name_key" ON "protheus_jobs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "protheus_integrations_name_key" ON "protheus_integrations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "protheus_tickets_number_key" ON "protheus_tickets"("number");

-- CreateIndex
CREATE INDEX "protheus_tickets_status_idx" ON "protheus_tickets"("status");

-- AddForeignKey
ALTER TABLE "protheus_patches" ADD CONSTRAINT "protheus_patches_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "protheus_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protheus_customizations" ADD CONSTRAINT "protheus_customizations_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "protheus_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protheus_customization_changelog" ADD CONSTRAINT "protheus_customization_changelog_customizationId_fkey" FOREIGN KEY ("customizationId") REFERENCES "protheus_customizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protheus_knowledge_items" ADD CONSTRAINT "protheus_knowledge_items_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "protheus_modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protheus_knowledge_fields" ADD CONSTRAINT "protheus_knowledge_fields_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "protheus_knowledge_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
