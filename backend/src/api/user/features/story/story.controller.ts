import { prisma } from "@/db";
import { createEndpoint, getStoryExpiryTime, getUserInfo } from "@/utils";

import {
  GetAllStoriesByUserIdValidator,
  PostCreateStoryValidator,
  PostViewStoryValidator,
} from "./story.validator";

export const postCreateStory = createEndpoint(
  PostCreateStoryValidator,
  async (req, res) => {
    const { user } = getUserInfo(req);
    const { ...storyInfo } = req.body;

    const story = await prisma.story.create({
      data: {
        ...storyInfo,
        userId: user.id,
      },
    });

    res.json({
      result: story,
    });
  }
);

export const getAllStoriesByUserId = createEndpoint(
  GetAllStoriesByUserIdValidator,
  async (req, res) => {
    const { userId } = req.params;

    // get stories not older than 24 hours
    const stories = await prisma.story.findMany({
      where: {
        userId,
        createdAt: {
          gte: getStoryExpiryTime(),
        },
      },
      include: {
        storyViews: {
          where: {
            viewerId: userId,
          },
        },
        _count: {
          select: {
            storyViews: true,
          },
        },
      },
    });

    res.json({
      result: stories,
    });
  }
);

export const postViewStory = createEndpoint(
  PostViewStoryValidator,
  async (req, res) => {
    const { storyId } = req.params;
    const { user } = getUserInfo(req);

    const storyView = await prisma.storyView.create({
      data: {
        storyId,
        viewerId: user.id,
      },
    });

    res.json({
      result: storyView,
    });
  }
);
