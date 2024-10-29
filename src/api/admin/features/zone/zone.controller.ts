import createError from "http-errors";
import { z } from "zod";

import { ID_VALIDATOR } from "@/constants";
import { prisma } from "@/db";
import { createEndpoint } from "@/utils";

export const getAllZones = createEndpoint({}, async (req, res) => {
  const zones = await prisma.zone.findMany({
    include: {
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
  });
  res.json({
    result: zones,
  });
});

export const getSingleZone = createEndpoint(
  {
    params: z.object({
      zoneId: ID_VALIDATOR,
    }),
  },
  async (req, res) => {
    const { zoneId } = req.params;
    const zone = await prisma.zone.findUnique({
      where: {
        id: zoneId,
      },
      include: {
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
    });
    if (!zone) throw createError(404, "SubAdmin not found");
    res.json({
      result: zone,
    });
  }
);
