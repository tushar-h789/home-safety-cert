import { Prisma } from "@prisma/client";

export type EngineersWithRelation = Prisma.UserGetPayload<{
    include: {
        address: true
    }
}>

export type StaffWithRelations = Prisma.UserGetPayload<{
    where: {
        role: "STAFF"
    },
    include: {
        address: true
    }
}>