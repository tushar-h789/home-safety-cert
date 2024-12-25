/*
  Warnings:

  - You are about to drop the column `category` on the `Certificate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "category";

-- DropEnum
DROP TYPE "CertificateCategory";
