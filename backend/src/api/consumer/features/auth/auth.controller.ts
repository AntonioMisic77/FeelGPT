import bcrypt from "bcrypt";
import createError from "http-errors";

import { prisma } from "@/db";
import { jwtSign } from "@/lib/jwt";
import { createEndpoint, getUserInfo } from "@/utils";

import {
  PostLoginConsumerValidator,
  PostRegisterConsumerValidator,
} from "./auth.validator";

export const postRegisterConsumer = createEndpoint(
  PostRegisterConsumerValidator,
  async (req, res) => {
    const { email, username, bio, ...rest } = req.body;

    const subAdmin = await prisma.subAdmin.findFirst();
    if (!subAdmin) throw createError(400, "No sub-admins available");

    const doesUserExist = await prisma.user.findFirst({
      where: {
        Consumer: {
          email,
        },
      },
    });
    if (doesUserExist) throw createError(400, "User already exists");

    const user = await prisma.user.create({
      data: {
        ...rest,
        Consumer: {
          create: {
            email,
            username,
            bio,
            managedBy: subAdmin.id,
          },
        },
      },
      include: {
        Consumer: true,
      },
    });

    const token = jwtSign({
      id: user.id,
    });

    const { password: notUsed, ...restUser } = user;

    res.json({
      result: { token, user: restUser },
    });
  }
);

export const postLoginConsumer = createEndpoint(
  PostLoginConsumerValidator,
  async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        Consumer: {
          email,
        },
      },
      include: {
        Consumer: true,
      },
    });
    if (!user) throw createError(400, "Invalid email/password");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw createError(400, "Invalid email/password");
    const token = jwtSign({
      id: user.id,
    });
    const { password: notUsed, ...restUser } = user;

    res.json({
      result: { token, user: restUser },
    });
  }
);

export const getConsumerMe = createEndpoint({}, async (req, res) => {
  const { user } = getUserInfo(req);
  const fetchedUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      Consumer: true,
      _count: {
        select: {
          followings: true,
          follows: true,
        },
      },
    },
  });
  if (!fetchedUser) throw createError(404, "User not found");
  const { password: notUsed, ...rest } = fetchedUser;
  res.json({
    result: rest,
  });
});
