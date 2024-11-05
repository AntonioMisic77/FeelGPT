import createError from "http-errors";
import { z } from "zod";

import { ID_VALIDATOR } from "@/constants";
import { prisma } from "@/db";
import { createEndpoint } from "@/utils";

export const getAllVendor = createEndpoint({}, async (req, res) => {
  const vendors = await prisma.vendor.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          gender: true,
          avatarUrl: true,
          isDeactivated: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      zone: {
        select: {
          id: true,
          name: true,
          rootAdmin: {
            include: {
              user: true,
            },
          },
          subAdmin: {
            include: {
              user: true,
            },
          },
        },
      },
      business: true,
    },
  });
  res.json({
    result: vendors,
  });
});

export const getSingleVendor = createEndpoint(
  {
    params: z.object({
      vendorId: ID_VALIDATOR,
    }),
  },
  async (req, res) => {
    const { vendorId } = req.params;
    const vendor = await prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            gender: true,
            avatarUrl: true,
            isDeactivated: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        zone: {
          select: {
            id: true,
            name: true,
            rootAdmin: {
              include: {
                user: true,
              },
            },
            subAdmin: {
              include: {
                user: true,
              },
            },
          },
        },
        business: true,
      },
    });
    if (!vendor) throw createError(404, "SubAdmin not found");
    res.json({
      result: vendor,
    });
  }
);
