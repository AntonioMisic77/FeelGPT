import { z } from "zod";

import { ID_VALIDATOR } from "@/constants";

export const PostUserFollowValidator = {
  params: z.object({
    userId: ID_VALIDATOR,
  }),
};

export const DeleteUserFollowValidator = {
  params: z.object({
    userId: ID_VALIDATOR,
  }),
};

export const GetUserFollowersValidator = {
  params: z.object({
    userId: ID_VALIDATOR,
  }),
};

export const GetUserFollowingsValidator = {
  params: z.object({
    userId: ID_VALIDATOR,
  }),
};
