import { PostMediaType } from "@prisma/client";
import { z } from "zod";

import { ID_VALIDATOR } from "@/constants";

const RATING_VALIDATOR = z.number().int().min(1).max(5);

export const PostCreatePostValidator = {
  body: z.object({
    caption: z.string().trim().min(1),
    mediaUrls: z
      .array(
        z.object({
          url: z.string().trim().url(),
          type: z.nativeEnum(PostMediaType),
        })
      )
      .optional(),
    review: z
      .object({
        businessId: ID_VALIDATOR,
        rating: RATING_VALIDATOR,
        itemsReviewed: z
          .array(
            z.object({
              menuItemId: ID_VALIDATOR,
              rating: RATING_VALIDATOR,
            })
          )
          .optional()
          .nullable(),
      })
      .optional()
      .nullable(),
  }),
};

export const GetAllReviewsByBusinessIdValidator = {
  params: z.object({
    businessId: ID_VALIDATOR,
  }),
};

export const GetAllPostsByUserIdValidator = {
  params: z.object({
    userId: ID_VALIDATOR,
  }),
};

export const GetSinglePostByIdValidator = {
  params: z.object({
    postId: ID_VALIDATOR,
  }),
};

export const PostPostLikeValidator = {
  params: z.object({
    postId: ID_VALIDATOR,
  }),
};

export const DeletePostLikeValidator = {
  params: z.object({
    postId: ID_VALIDATOR,
  }),
};
