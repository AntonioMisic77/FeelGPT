import createError from "http-errors";

import { prisma } from "@/db";
import { createEndpoint, getUserInfo } from "@/utils";

import {
  PostUserFollowValidator,
  DeleteUserFollowValidator,
  GetUserFollowersValidator,
  GetUserFollowingsValidator,
} from "./follow.validator";

export const postUserFollow = createEndpoint(
  PostUserFollowValidator,
  async (req, res) => {
    const { userId: followingId } = req.params;
    const {
      user: { id: followerId },
    } = getUserInfo(req);

    if (followingId === followerId)
      throw createError(400, "You cannot follow yourself");

    const post = await prisma.follow.create({
      data: {
        followerId,
        followingId,
        Notification: {
          create: {
            type: "FOLLOWED",
            userId: followingId,
          },
        },
      },
    });

    res.json({
      result: post,
    });
  }
);

export const deleteUserFollow = createEndpoint(
  DeleteUserFollowValidator,
  async (req, res) => {
    const { userId: followingId } = req.params;
    const {
      user: { id: followerId },
    } = getUserInfo(req);

    if (followingId === followerId)
      throw createError(400, "You cannot un-follow yourself");

    const post = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    res.json({
      result: post,
    });
  }
);

export const getUserFollowers = createEndpoint(
  GetUserFollowersValidator,
  async (req, res) => {
    const { userId: followingId } = req.params;
    const { user: loggedInUser } = getUserInfo(req);

    const followers = await prisma.follow.findMany({
      where: {
        followingId,
      },
      include: {
        follower: {
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
            followings: {
              where: {
                followerId: loggedInUser.id,
              },
            },
          },
        },
      },
    });

    res.json({
      result: followers.map((follower) => follower.follower),
    });
  }
);

export const getUserFollowings = createEndpoint(
  GetUserFollowingsValidator,
  async (req, res) => {
    const { userId: followerId } = req.params;
    const { user: loggedInUser } = getUserInfo(req);

    const followings = await prisma.follow.findMany({
      where: {
        followerId,
      },
      include: {
        following: {
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
            followings: {
              where: {
                followerId: loggedInUser.id,
              },
            },
          },
        },
      },
    });

    // flatten the followings array to users only

    res.json({
      result: followings.map((following) => following.following),
    });
  }
);
