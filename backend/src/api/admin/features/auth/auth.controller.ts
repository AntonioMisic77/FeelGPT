/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/prefer-default-export */
import bcrypt from "bcrypt";
import createError from "http-errors";

import { prisma } from "@/db";
import { jwtSign } from "@/lib/jwt";
import { createEndpoint, getUserInfo } from "@/utils";

import { PostLoginAdminValidator } from "./auth.validator";

export const postLoginAdmin = createEndpoint(
  PostLoginAdminValidator,
  async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            RootAdmin: {
              email,
            },
          },
          {
            SubAdmin: {
              email,
            },
          },
        ],
      },
      include: {
        RootAdmin: true,
        SubAdmin: true,
      },
    });
    if (!user) throw createError(400, "Invalid email/password");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw createError(400, "Invalid email/password");
    const token = jwtSign({
      id: user.id,
    });
    const { RootAdmin } = user;
    res.json({
      result: {
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.RootAdmin?.email ?? user.SubAdmin?.email,
          userType: RootAdmin ? "RootAdmin" : "SubAdmin",
        },
      },
    });
  }
);

export const getAdminMe = createEndpoint({}, async (req, res) => {
  const { user } = getUserInfo(req);
  const fetchedUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      RootAdmin: true,
      SubAdmin: true,
    },
  });
  if (!fetchedUser) throw createError(404, "User not found");
  const { password: notUsed, ...rest } = fetchedUser;
  res.json({
    result: {
      id: rest.id,
      firstName: rest.firstName,
      lastName: rest.lastName,
      email: rest.RootAdmin?.email || rest.SubAdmin?.email,
      userType: rest.RootAdmin ? "RootAdmin" : "SubAdmin",
    },
  });
});
