import createError from "http-errors";

import { prisma } from "@/db";
import { createEndpoint } from "@/utils";

import { GetRatingInfoValidator } from "./business.validator";

export const getRatingInfo = createEndpoint(
  GetRatingInfoValidator,
  async (req, res) => {
    const { businessId } = req.params;
    const ratingInfo = await prisma.review.groupBy({
      by: ["rating"],
      where: {
        businessId,
      },
      _count: {
        rating: true,
      },
    });
    if (!ratingInfo) throw createError(400, "No business found");
    res.json({
      result: ratingInfo,
    });
  }
);

export const getAllBusinesses = createEndpoint({}, async (req, res) => {
  const businesses = await prisma.business.findMany({
    select: {
      id: true,
      name: true,
      vendor: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              firstName: true,
              avatarUrl: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
  res.json({
    result: businesses,
  });
});
