import { Business, User, Vendor } from "@prisma/client";
import createHttpError from "http-errors";

import { CustomRequest } from "@/types";
import { getUserInfo } from "@/utils";

type ReturnedVendorUser = User & {
  Vendor: Vendor & {
    business: Business;
  };
};

export const getVendorInfo = (
  req: CustomRequest
): {
  user: ReturnedVendorUser;
} => {
  const { user } = getUserInfo(req);
  if (!user.Vendor) throw createHttpError(401, "Unauthorized");
  if (!user.Vendor.business) throw createHttpError(401, "Unauthorized");
  return {
    user: user as ReturnedVendorUser,
  };
};

export default getVendorInfo;
