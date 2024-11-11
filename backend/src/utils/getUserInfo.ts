import createHttpError from "http-errors";

import { CustomRequest } from "@/types";

export const getUserInfo = (req: CustomRequest) => {
  const { user } = req;
  if (!user) throw createHttpError(401, "Unauthorized");
  return { user };
};

export default getUserInfo;
