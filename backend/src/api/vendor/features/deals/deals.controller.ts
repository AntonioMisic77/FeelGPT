// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/prefer-default-export */
import createError from "http-errors";

import { prisma } from "@/db";
import { createEndpoint } from "@/utils";

import { getVendorInfo } from "../../utils";

import {
  PostCreateDealValidator,
  GetAllDealsValidator,
  GetSingleDealValidator,
  DeleteDealValidator,
} from "./deals.validator";

export const postCreateDeal = createEndpoint(
  PostCreateDealValidator,

  async (req, res) => {
    const { menuItems, ...dealInfo } = req.body;
    const { user } = getVendorInfo(req);
    const deal = await prisma.deal.create({
      data: {
        ...dealInfo,
        businessId: user.Vendor.business.id,
        dealItems: {
          create: menuItems,
        },
      },
      include: {
        dealItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.json({
      result: deal,
    });
  }
);

export const getAllDeals = createEndpoint(
  GetAllDealsValidator,
  async (req, res) => {
    const { vendorId } = req.params;
    const deals = await prisma.deal.findMany({
      where: {
        business: {
          vendorId,
        },
      },
      include: {
        dealItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });
    res.json({
      result: deals,
    });
  }
);

export const getSingleDeal = createEndpoint(
  GetSingleDealValidator,
  async (req, res) => {
    const { dealId } = req.params;
    const deal = await prisma.deal.findUnique({
      where: {
        id: dealId,
      },
      include: {
        dealItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });
    if (!deal) throw new createError.NotFound("Deal not found");
    res.json({
      result: deal,
    });
  }
);

export const deleteDeal = createEndpoint(
  DeleteDealValidator,
  async (req, res) => {
    const { dealId } = req.params;
    const deal = await prisma.deal.delete({
      where: {
        id: dealId,
      },
      include: {
        dealItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });
    if (!deal) throw new createError.NotFound("Deal not found");
    res.json({
      result: deal,
    });
  }
);
