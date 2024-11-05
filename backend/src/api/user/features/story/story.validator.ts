import { UserStoriesType } from "@prisma/client";
import { z } from "zod";

import { ID_VALIDATOR } from "@/constants";

export const PostCreateStoryValidator = {
  body: z.object({
    caption: z.string().trim().min(1).max(100).optional(),
    url: z.string().trim().url(),
    type: z.nativeEnum(UserStoriesType),
  }),
};

export const GetAllStoriesByUserIdValidator = {
  params: z.object({
    userId: ID_VALIDATOR,
  }),
};

export const PostViewStoryValidator = {
  params: z.object({
    storyId: ID_VALIDATOR,
  }),
};
