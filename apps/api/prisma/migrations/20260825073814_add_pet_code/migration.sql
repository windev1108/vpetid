/*
  Warnings:

  - A unique constraint covering the columns `[petCode]` on the table `pets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `petCode` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "petCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pets_petCode_key" ON "pets"("petCode");
