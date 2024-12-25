/*
  Warnings:

  - Added the required column `propertyType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyType` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'NOT_APPLICABLE');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "propertyType" "PropertyType" NOT NULL;

-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "propertyType" "PropertyType" NOT NULL;
