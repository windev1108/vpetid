-- CreateEnum
CREATE TYPE "ReminderChannel" AS ENUM ('IN_APP', 'PUSH', 'EMAIL', 'SMS');

-- CreateTable
CREATE TABLE "HealthReminderConfig" (
    "id" UUID NOT NULL,
    "petId" UUID NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "remindBeforeDays" INTEGER NOT NULL DEFAULT 7,
    "channels" "ReminderChannel"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthReminderConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HealthReminderConfig_petId_key" ON "HealthReminderConfig"("petId");

-- CreateIndex
CREATE INDEX "HealthReminderConfig_petId_idx" ON "HealthReminderConfig"("petId");

-- AddForeignKey
ALTER TABLE "HealthReminderConfig" ADD CONSTRAINT "HealthReminderConfig_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
