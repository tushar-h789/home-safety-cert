-- CreateEnum
CREATE TYPE "ResidentialType" AS ENUM ('BUNGALOW', 'MID_TERRACED_HOUSE', 'DETACHED_HOUSE', 'SEMI_DETACHED_HOUSE', 'FLAT', 'APARTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "CommercialType" AS ENUM ('PUB', 'STORE', 'OFFICE', 'RESTAURANT', 'WAREHOUSE', 'OTHER');

-- CreateEnum
CREATE TYPE "ParkingOptions" AS ENUM ('PAID', 'FREE', 'NO');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "commercialType" "CommercialType",
ADD COLUMN     "parkingOptions" "ParkingOptions" NOT NULL DEFAULT 'NO',
ADD COLUMN     "residentialType" "ResidentialType";

-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "commercialType" "CommercialType",
ADD COLUMN     "residentialType" "ResidentialType";
