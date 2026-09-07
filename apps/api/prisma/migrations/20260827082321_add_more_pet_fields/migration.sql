-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('LBS', 'KG');

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "existingTagId" TEXT,
ADD COLUMN     "microchipNumber" DECIMAL(65,30),
ADD COLUMN     "weight" DECIMAL(5,2),
ADD COLUMN     "weightUnit" "WeightUnit" DEFAULT 'KG';
