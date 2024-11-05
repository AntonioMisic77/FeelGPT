import createError from "http-errors";

import { prisma } from "@/db";
import { createEndpoint, getUserInfo } from "@/utils";

import {
  DeletePostLikeValidator,
  GetAllPostsByUserIdValidator,
  GetSinglePostByIdValidator,
  PostCreatePostValidator,
  PostPostLikeValidator,
  GetAllReviewsByBusinessIdValidator,
} from "./post.validator";

export const postCreatePost = createEndpoint(
  PostCreatePostValidator,
  async (req, res) => {
    const { caption, mediaUrls, review } = req.body;
    const { user } = getUserInfo(req);
    const post = await prisma.post.create({
      data: {
        caption,
        postMedia: {
          create: mediaUrls,
        },
        createdBy: user.id,
        ...(review && {
          review: {
            create: {
              rating: review.rating,
              businessId: review.businessId,
              ...(review.itemsReviewed && {
                itemsReviewed: {
                  create: review.itemsReviewed,
                },
              }),
            },
          },
        }),
      },
      include: {
        _count: {
          select: {
            postComments: true,
            postLikes: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            avatarUrl: true,
            lastName: true,
            Vendor: {
              select: {
                id: true,
              },
            },
          },
        },
        postMedia: true,
        postLikes: {
          where: {
            likedBy: user.id,
          },
        },
        review: {
          include: {
            itemsReviewed: {
              include: {
                menuItem: true,
              },
            },
          },
        },
      },
    });

    // update business rating if review is present
    if (review) {
      const business = await prisma.business.findUnique({
        where: {
          id: review.businessId,
        },
        select: {
          aggregateRating: true,
          reviewCount: true,
        },
      });

      if (!business) throw createError(404, "Business not found");

      const newAggregateRating =
        (business.aggregateRating.toNumber() * business.reviewCount +
          review.rating) /
        (business.reviewCount + 1);

      await prisma.business.update({
        where: {
          id: review.businessId,
        },
        data: {
          aggregateRating: newAggregateRating,
          reviewCount: business.reviewCount + 1,
        },
      });

      // do the same for items

      if (review.itemsReviewed?.length) {
        const updateItemRatings = review.itemsReviewed.map(async (item) => {
          const itemInDb = await prisma.menuItem.findUnique({
            where: {
              id: item.menuItemId,
            },
            select: {
              aggregateRating: true,
              reviewCount: true,
            },
          });

          if (!itemInDb) throw createError(404, "Menu item not found");

          const newAggregateItemRating =
            (itemInDb.aggregateRating.toNumber() * itemInDb.reviewCount +
              item.rating) /
            (itemInDb.reviewCount + 1);

          return prisma.menuItem.update({
            where: {
              id: item.menuItemId,
            },
            data: {
              aggregateRating: newAggregateItemRating,
              reviewCount: itemInDb.reviewCount + 1,
            },
          });
        });

        await Promise.all(updateItemRatings);
      }
    }

    res.json({
      result: post,
    });
  }
);

export const getAllReviewsByBusinessId = createEndpoint(
  GetAllReviewsByBusinessIdValidator,
  async (req, res) => {
    const { businessId } = req.params;
    const { user } = getUserInfo(req);

    const posts = await prisma.post.findMany({
      where: {
        review: {
          businessId,
        },
      },
      include: {
        _count: {
          select: {
            postComments: true,
            postLikes: true,
          },
        },
        creator: {
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
        postMedia: true,
        postLikes: {
          where: {
            likedBy: user.id,
          },
        },
        review: {
          include: {
            itemsReviewed: {
              include: {
                menuItem: true,
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
      result: posts,
    });
  }
);

export const getAllPostsByUserId = createEndpoint(
  GetAllPostsByUserIdValidator,
  async (req, res) => {
    const { userId } = req.params;
    const { user } = getUserInfo(req);

    const posts = await prisma.post.findMany({
      where: {
        createdBy: userId,
      },
      include: {
        _count: {
          select: {
            postComments: true,
            postLikes: true,
          },
        },
        creator: {
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
        postMedia: true,
        postLikes: {
          where: {
            likedBy: user.id,
          },
        },
        review: {
          include: {
            itemsReviewed: {
              include: {
                menuItem: true,
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
      result: posts,
    });
  }
);

export const getSinglePostById = createEndpoint(
  GetSinglePostByIdValidator,
  async (req, res) => {
    const { postId } = req.params;
    const { user } = getUserInfo(req);

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        _count: {
          select: {
            postComments: true,
            postLikes: true,
          },
        },
        creator: {
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
        postMedia: true,
        postLikes: {
          where: {
            likedBy: user.id,
          },
        },
        review: {
          include: {
            itemsReviewed: {
              include: {
                menuItem: true,
              },
            },
          },
        },
      },
    });

    res.json({
      result: post,
    });
  }
);

export const postPostLike = createEndpoint(
  PostPostLikeValidator,
  async (req, res) => {
    const { postId } = req.params;
    const { user } = getUserInfo(req);

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        createdBy: true,
      },
    });

    if (!post) throw createError(404, "Post not found");

    const postLike = await prisma.postLike.create({
      data: {
        postId,
        likedBy: user.id,
        Notification: {
          create: {
            type: "POST_LIKE",
            userId: post.createdBy,
          },
        },
      },
    });

    res.json({
      result: postLike,
    });
  }
);

export const deletePostLike = createEndpoint(
  DeletePostLikeValidator,
  async (req, res) => {
    const { postId } = req.params;
    const { user } = getUserInfo(req);

    const postUnlike = await prisma.postLike.delete({
      where: {
        PostLikeUnique: {
          postId,
          likedBy: user.id,
        },
      },
    });

    res.json({
      result: postUnlike,
    });
  }
);
