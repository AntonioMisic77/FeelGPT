import { User, Consumer } from "@prisma/client";
import createHttpError from "http-errors";

import { CustomRequest } from "@/types";
import { getUserInfo } from "@/utils";

type ReturnedConsumerUser = User & {
  Consumer: Consumer;
};

export const getConsumerInfo = (req: CustomRequest) => {
  const { user } = getUserInfo(req);
  if (!user.Consumer) throw createHttpError(401, "Unauthorized");
  return { user: user as ReturnedConsumerUser };
};

export default getConsumerInfo;
