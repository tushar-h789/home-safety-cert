-- CreateEnum
CREATE TYPE "CertificateCategory" AS ENUM ('ELECTRICAL', 'FIRE', 'GAS', 'HEALTH_SAFETY', 'OTHER');

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "dateOfIssue" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "category" "CertificateCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
