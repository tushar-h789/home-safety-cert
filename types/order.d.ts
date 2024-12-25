import { Prisma } from "@prisma/client";

export type OrderWithRelation = Prisma.OrderGetPayload<{
  include: {
    packages: true;
    user: {
      include: {
        address: true;
      };
    };
    assignedEngineer: true;
  };
}>;

export type Pagination = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};
