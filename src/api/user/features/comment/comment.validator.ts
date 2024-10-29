import { z } from "zod";

import { ID_VALIDATOR } from "@/constants";

export const PostCreateCommentValidator = {
  body: z.object({
    content: z.string().trim().min(1).max(100),
    postId: ID_VALIDATOR,
  }),
};

export const GetAllCommentsByPostIdValidator = {
  params: z.object({
    postId: ID_VALIDATOR,
  }),
};

export const PostCommentLikeValidator = {
  params: z.object({
    commentId: ID_VALIDATOR,
  }),
};

export const DeleteCommentLikeValidator = {
  params: z.object({
    commentId: ID_VALIDATOR,
  }),
};
