-- CreateEnum
CREATE TYPE "PetNoteType" AS ENUM ('GENERAL', 'HEALTH', 'FOOD', 'BEHAVIOR', 'MEDICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "VaccinationStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'MISSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PetRelationType" AS ENUM ('PARENT');

-- CreateTable
CREATE TABLE "pet_notes" (
    "id" UUID NOT NULL,
    "petId" UUID NOT NULL,
    "type" "PetNoteType" NOT NULL DEFAULT 'GENERAL',
    "title" TEXT,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "occurredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pet_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_vaccinations" (
    "id" UUID NOT NULL,
    "petId" UUID NOT NULL,
    "vaccineName" TEXT NOT NULL,
    "status" "VaccinationStatus" NOT NULL DEFAULT 'SCHEDULED',
    "administeredAt" TIMESTAMP(3),
    "nextDueAt" TIMESTAMP(3),
    "veterinarian" TEXT,
    "clinic" TEXT,
    "batchNumber" TEXT,
    "manufacturer" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pet_vaccinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_relations" (
    "id" UUID NOT NULL,
    "parentId" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "relation" "PetRelationType" NOT NULL DEFAULT 'PARENT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pet_relations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pet_notes_petId_idx" ON "pet_notes"("petId");

-- CreateIndex
CREATE INDEX "pet_notes_petId_createdAt_idx" ON "pet_notes"("petId", "createdAt");

-- CreateIndex
CREATE INDEX "pet_notes_petId_type_idx" ON "pet_notes"("petId", "type");

-- CreateIndex
CREATE INDEX "pet_vaccinations_petId_idx" ON "pet_vaccinations"("petId");

-- CreateIndex
CREATE INDEX "pet_vaccinations_petId_status_idx" ON "pet_vaccinations"("petId", "status");

-- CreateIndex
CREATE INDEX "pet_vaccinations_nextDueAt_idx" ON "pet_vaccinations"("nextDueAt");

-- CreateIndex
CREATE INDEX "pet_relations_parentId_idx" ON "pet_relations"("parentId");

-- CreateIndex
CREATE INDEX "pet_relations_childId_idx" ON "pet_relations"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "pet_relations_parentId_childId_key" ON "pet_relations"("parentId", "childId");

-- AddForeignKey
ALTER TABLE "pet_notes" ADD CONSTRAINT "pet_notes_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_vaccinations" ADD CONSTRAINT "pet_vaccinations_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_relations" ADD CONSTRAINT "pet_relations_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_relations" ADD CONSTRAINT "pet_relations_childId_fkey" FOREIGN KEY ("childId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
