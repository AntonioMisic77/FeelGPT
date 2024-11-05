import createError from "http-errors";

import { prisma } from "@/db";
import { createEndpoint } from "@/utils";

import {
  PostCreateMenuItemValidator,
  DeleteMenuItemValidator,
  PutMenuItemValidator,
  GetSingleMenuItemValidator,
  GetAllMenuItemsForBusinessValidator,
} from "./menuItem.validator";

export const postCreateMenuItem = createEndpoint(
  PostCreateMenuItemValidator,
  async (req, res) => {
    const { ...menuItemInfo } = req.body;
    const menuItem = await prisma.menuItem.create({
      data: {
        ...menuItemInfo,
      },
    });
    res.json({
      result: menuItem,
    });
  }
);

export const deleteMenuItem = createEndpoint(
  DeleteMenuItemValidator,
  async (req, res) => {
    const { menuItemId } = req.params;
    const menuItem = await prisma.menuItem.update({
      where: {
        id: menuItemId,
      },
      data: {
        isArchived: true,
      },
    });
    res.json({
      result: menuItem,
    });
  }
);

export const putMenuItem = createEndpoint(
  PutMenuItemValidator,
  async (req, res) => {
    const { menuItemId } = req.params;
    const { ...updateMenuItemInfo } = req.body;
    const menuItem = await prisma.menuItem.update({
      where: {
        id: menuItemId,
      },
      data: {
        ...updateMenuItemInfo,
      },
    });
    res.json({
      result: menuItem,
    });
  }
);

export const getSingleMenuItem = createEndpoint(
  GetSingleMenuItemValidator,
  async (req, res) => {
    const { menuItemId } = req.params;
    const menuItem = await prisma.menuItem.findUnique({
      where: {
        id: menuItemId,
      },
      include: {
        menuCategory: true,
      },
    });
    if (!menuItem) throw new createError.NotFound("Menu item not found");
    res.json({
      result: menuItem,
    });
  }
);

export const getAllMenuItemsForBusiness = createEndpoint(
  GetAllMenuItemsForBusinessValidator,
  async (req, res) => {
    const { businessId } = req.params;
    const menuItems = await prisma.menuItem.findMany({
      where: {
        menuCategory: {
          businessId,
        },
        isArchived: false,
      },
      include: {
        menuCategory: true,
      },
    });
    res.json({
      result: menuItems,
    });
  }
);
