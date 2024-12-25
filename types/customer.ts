import { Prisma } from "@prisma/client";

export type CustomerWithRelation = Prisma.UserGetPayload<{
    include: {
        address: true
    }
}>