// pages/api/orders.ts
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // console.log(req, res);
    
  if (req.method === "GET") {
    try {
      const orders = await prisma.order.findMany({
        include: {
          user: {
            include: {
              address: true,
            },
          },
        },
      });
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch orders." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
