import createError from "http-errors";

import { prisma } from "@/db";
import { createEndpoint, getUserInfo } from "@/utils";

import {
  DeleteCommentLikeValidator,
  GetAllCommentsByPostIdValidator,
  PostCommentLikeValidator,
  PostCreateCommentValidator,
} from "./comment.validator";

export const postCreateComment = createEndpoint(
  PostCreateCommentValidator,
  async (req, res) => {
    const { ...commentInfo } = req.body;
    const { user } = getUserInfo(req);

    const post = await prisma.post.findUnique({
      where: {
        id: commentInfo.postId,
      },
      select: {
        createdBy: true,
      },
    });

    if (!post) throw createError(404, "Post not found");

    const comment = await prisma.postComment.create({
      data: {
        ...commentInfo,
        commentedBy: user.id,
        Notification: {
          create: {
            type: "POST_COMMENT",
            userId: post.createdBy,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            avatarUrl: true,
            lastName: true,
            Vendor: {
              select: {
                id: true,
                business: {
                  select: {
                    name: true,
                    aggregateRating: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.json({
      result: comment,
    });
  }
);

export const getAllCommentsByPostId = createEndpoint(
  GetAllCommentsByPostIdValidator,
  async (req, res) => {
    const { postId } = req.params;
    const { user } = getUserInfo(req);
    const comments = await prisma.postComment.findMany({
      where: {
        postId,
      },
      include: {
        CommentLike: {
          where: {
            likedBy: user.id,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            avatarUrl: true,
            lastName: true,
            Vendor: {
              select: {
                id: true,
                business: {
                  select: {
                    name: true,
                    aggregateRating: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      result: comments,
    });
  }
);

export const postCommentLike = createEndpoint(
  PostCommentLikeValidator,
  async (req, res) => {
    const { commentId } = req.params;
    const { user } = getUserInfo(req);
    const commentLike = await prisma.commentLike.create({
      data: {
        commentId,
        likedBy: user.id,
      },
    });

    res.json({
      result: commentLike,
    });
  }
);

export const deleteCommentLike = createEndpoint(
  DeleteCommentLikeValidator,
  async (req, res) => {
    const { commentId } = req.params;
    const { user } = getUserInfo(req);

    const commentUnlike = await prisma.commentLike.delete({
      where: {
        CommentLikeUnique: {
          commentId,
          likedBy: user.id,
        },
      },
    });

    res.json({
      result: commentUnlike,
    });
  }
);
