import createError from "http-errors";
import { z } from "zod";

import { ID_VALIDATOR } from "@/constants";
import { prisma } from "@/db";
import { createEndpoint } from "@/utils";

// type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export const getAllSubAdmins = createEndpoint({}, async (req, res) => {
  const subAdmins = await prisma.subAdmin.findMany({
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
      zones: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  res.json({
    result: subAdmins,
  });
});

export const getSingleSubAdmin = createEndpoint(
  {
    params: z.object({
      subAdminId: ID_VALIDATOR,
    }),
  },
  async (req, res) => {
    const { subAdminId } = req.params;
    const subAdmin = await prisma.subAdmin.findUnique({
      where: {
        id: subAdminId,
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
        zones: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!subAdmin) throw createError(404, "SubAdmin not found");
    res.json({
      result: subAdmin,
    });
  }
);
