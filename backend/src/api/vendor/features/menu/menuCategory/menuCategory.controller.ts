import { getVendorInfo } from "@/api/vendor/utils";
import { prisma } from "@/db";
import { createEndpoint } from "@/utils";

import {
  PostCreateMenuCategoryValidator,
  GetAllMenuCategoriesValidator,
} from "./menuCategory.validator";

export const postCreateMenuCategory = createEndpoint(
  PostCreateMenuCategoryValidator,
  async (req, res) => {
    const { user } = getVendorInfo(req);
    const menuCategory = await prisma.menuCategory.create({
      data: {
        name: req.body.name,
        businessId: user.Vendor.business.id,
      },
    });
    res.json({
      result: menuCategory,
    });
  }
);

export const getAllMenuCategories = createEndpoint(
  GetAllMenuCategoriesValidator,
  async (req, res) => {
    const { vendorId } = req.params;
    const menuCategories = await prisma.menuCategory.findMany({
      where: {
        business: {
          vendorId,
        },
      },
      include: {
        menuItems: {
          where: {
            isArchived: false,
          },
        },
      },
    });
    res.json({
      result: menuCategories,
    });
  }
);
