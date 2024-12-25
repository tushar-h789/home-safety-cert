"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, unstable_cache as cache } from "next/cache";
import { SiteSettingsFormValues, siteSettingsSchema } from "./schema";
import { handlePrismaError } from "@/lib/prisma-error";

export const getSettings = cache(async () => {
  try {
    const settings = await prisma.siteSettings.findFirst({
      include: {
        user: {
          include: {
            address: true,
          },
        },
        openingDateTime: true,
      },
    });
    return settings;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    throw new Error("Failed to fetch site settings");
  }
});

export async function updateSiteSettings(
  input: SiteSettingsFormValues,
  userId: string
) {
  try {
    const validatedData = siteSettingsSchema.parse(input);

    // Check if the user is an admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      throw new Error("Unauthorized: Only admins can update site settings");
    }

    // Check if settings already exist
    const existingSettings = await prisma.siteSettings.findFirst();

    if (existingSettings) {
      // Update existing settings
      const updatedSettings = await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: {
          email: validatedData.email,
          phone1: validatedData.phone1,
          phone2: validatedData.phone2,
          whatsapp: validatedData.whatsapp,
          websiteUrl: validatedData.websiteUrl,
          facebookUrl: validatedData.facebookUrl,
          twitterUrl: validatedData.twitterUrl,
          instagramUrl: validatedData.instagramUrl,
          openingDateTime: {
            deleteMany: {},
            create: validatedData.openingDateTime.map(
              ({ dayOfWeek, openingTime, closingTime }) => ({
                dayOfWeek,
                openingTime,
                closingTime,
              })
            ),
          },
          user: {
            update: {
              address: {
                upsert: {
                  create: {
                    street: validatedData.address.street,
                    city: validatedData.address.city,
                    postcode: validatedData.address.postcode,
                  },
                  update: {
                    street: validatedData.address.street,
                    city: validatedData.address.city,
                    postcode: validatedData.address.postcode,
                  },
                },
              },
            },
          },
        },
        include: {
          openingDateTime: true,
          user: { include: { address: true } },
        },
      });

      revalidatePath("/", "layout");

      return {
        success: true,
        data: updatedSettings,
        message: "Site settings updated successfully",
      };
    } else {
      // Create new settings
      const newSettings = await prisma.siteSettings.create({
        data: {
          email: validatedData.email,
          phone1: validatedData.phone1,
          phone2: validatedData.phone2,
          whatsapp: validatedData.whatsapp,
          websiteUrl: validatedData.websiteUrl,
          facebookUrl: validatedData.facebookUrl,
          twitterUrl: validatedData.twitterUrl,
          instagramUrl: validatedData.instagramUrl,
          openingDateTime: {
            create: validatedData.openingDateTime.map(
              ({ dayOfWeek, openingTime, closingTime }) => ({
                dayOfWeek,
                openingTime,
                closingTime,
              })
            ),
          },
          user: {
            connect: { id: userId },
          },
        },
        include: {
          openingDateTime: true,
          user: { include: { address: true } },
        },
      });

      // Update user's address separately
      await prisma.address.upsert({
        where: { userId: userId },
        create: {
          street: validatedData.address.street,
          city: validatedData.address.city,
          postcode: validatedData.address.postcode,
          user: { connect: { id: userId } },
        },
        update: {
          street: validatedData.address.street,
          city: validatedData.address.city,
          postcode: validatedData.address.postcode,
        },
      });

      revalidatePath("/", "layout");

      return {
        success: true,
        data: newSettings,
        message: "Site settings created successfully",
      };
    }
  } catch (error) {
    console.error("Failed to update/create site settings:", error);
    return handlePrismaError(error);
  }
}
