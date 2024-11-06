/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/prefer-default-export */
import { prisma } from "@/db";
import { createEndpoint, getUserInfo } from "@/utils";

export const getUserNotifications = createEndpoint({}, async (req, res) => {
  const { user } = getUserInfo(req);

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      createdAt: true,
      type: true,
      postComment: {
        include: {
          post: {
            include: {
              postMedia: true,
            },
          },
          user: true,
        },
      },
      postLike: {
        include: {
          post: {
            include: {
              postMedia: true,
            },
          },
          user: true,
        },
      },
      followed: {
        include: {
          follower: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({
    result: notifications,
  });
});
