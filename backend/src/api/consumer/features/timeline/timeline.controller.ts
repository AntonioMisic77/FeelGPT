/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/prefer-default-export */
import { prisma } from "@/db";
import { createEndpoint, getStoryExpiryTime, getUserInfo } from "@/utils";

export const getUserTimelinePosts = createEndpoint({}, async (req, res) => {
  const { user } = getUserInfo(req);

  const followings = await prisma.follow.findMany({
    where: {
      followerId: user.id,
    },
    include: {
      following: {
        include: {
          posts: {
            include: {
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
              review: {
                select: {
                  businessId: true,
                  postId: true,
                  id: true,
                  rating: true,
                  itemsReviewed: {
                    select: {
                      rating: true,
                      menuItem: {
                        select: {
                          id: true,
                          menuCategoryId: true,
                          name: true,
                          description: true,
                          imageUrl: true,
                          price: true,
                          aggregateRating: true,
                        },
                      },
                    },
                  },
                  business: true,
                },
              },
              postMedia: true,
              postLikes: {
                where: {
                  likedBy: user.id,
                },
              },
              _count: {
                select: {
                  postComments: true,
                  postLikes: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const timelinePosts = followings
    .map(({ following }) => following.posts)
    .flat();

  const sortedTimelinePosts = timelinePosts.sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1;
    if (a.createdAt < b.createdAt) return 1;
    return 0;
  });

  res.json({
    result: sortedTimelinePosts,
  });
});

export const getUserTimelineStories = createEndpoint({}, async (req, res) => {
  const { user } = getUserInfo(req);

  const followingsStories = await prisma.follow.findMany({
    where: {
      followerId: user.id,
    },
    include: {
      following: {
        include: {
          stories: {
            where: {
              createdAt: {
                gte: getStoryExpiryTime(),
              },
            },
            include: {
              storyViews: {
                where: {
                  viewerId: user.id,
                },
              },
              _count: {
                select: {
                  storyViews: true,
                },
              },
            },
          },
        },
      },
    },
  });

  res.json({
    result: followingsStories,
  });
});
