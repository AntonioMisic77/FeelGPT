import { User, SubAdmin, RootAdmin } from "@prisma/client";
import createHttpError from "http-errors";

import { CustomRequest } from "@/types";
import { getUserInfo } from "@/utils";

type ReturnedAdminInfo = User & {
  SubAdmin: SubAdmin | null;
  RootAdmin: RootAdmin | null;
};

type ReturnedRootAdminInfo = User & {
  RootAdmin: RootAdmin;
};

type ReturnedSubAdminInfo = User & {
  SubAdmin: SubAdmin;
};

export const getAdminInfo = (req: CustomRequest) => {
  const { user } = getUserInfo(req);
  if (!user.RootAdmin && !user.SubAdmin) {
    throw createHttpError(401, "Unauthorized");
  }

  return {
    user: user as ReturnedAdminInfo,
    isRootAdmin: !!user.RootAdmin,
  };
};

export const getRootAdminInfo = (req: CustomRequest) => {
  const { user } = getAdminInfo(req);
  if (!user.RootAdmin) throw createHttpError(401, "Unauthorized");
  return { user: user as ReturnedRootAdminInfo };
};

export const getSubAdminInfo = (req: CustomRequest) => {
  const { user } = getAdminInfo(req);
  if (!user.SubAdmin) throw createHttpError(401, "Unauthorized");
  return { user: user as ReturnedSubAdminInfo };
};
export default getAdminInfo;
