/*
  Warnings:

  - Added the required column `inspectionTime` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'CASH_TO_ENGINEER', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "InspectionTime" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

-- CreateEnum
CREATE TYPE "PackageCategory" AS ENUM ('ELECTRICAL', 'FIRE', 'GAS', 'HEALTH_SAFETY');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('CERTIFICATE', 'REPAIR', 'INSTALLATION', 'INSPECTION', 'OTHER');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "inspectionTime" "InspectionTime" NOT NULL,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CREDIT_CARD',
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "Parking";

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "title" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "PackageCategory" NOT NULL,
    "serviceName" TEXT NOT NULL,
    "type" "PackageType",
    "unitType" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone1" TEXT,
    "phone2" TEXT,
    "whatsapp" TEXT,
    "websiteUrl" TEXT,
    "facebookUrl" TEXT,
    "twitterUrl" TEXT,
    "instagramUrl" TEXT,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpeningDateTime" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "openingTime" TEXT NOT NULL,
    "closingTime" TEXT NOT NULL,
    "siteSettingsId" TEXT NOT NULL,

    CONSTRAINT "OpeningDateTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettings_userId_key" ON "SiteSettings"("userId");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSettings" ADD CONSTRAINT "SiteSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningDateTime" ADD CONSTRAINT "OpeningDateTime_siteSettingsId_fkey" FOREIGN KEY ("siteSettingsId") REFERENCES "SiteSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
