/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "coverUrl" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "coverUrl";
