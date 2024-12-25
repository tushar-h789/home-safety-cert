import { Prisma } from "@prisma/client";

// Type for certificates with user relation
export type CertificateWithUser = Prisma.CertificateGetPayload<{
  include: {
    user: true; // Include user details
  };
}>;

// Type for certificates of a specific category
export type CertificateWithCategory = Prisma.CertificateGetPayload<{
  // where: {
  //   category: CertificateCategory; // Filter by category
  // };
  include: {
    user: true; // Include user details
  };
}>;

// General type for certificates with user relation
export type CertificateWithRelation = Prisma.CertificateGetPayload<{
  include: {
    user: true; // Include user information
  };
}>;
