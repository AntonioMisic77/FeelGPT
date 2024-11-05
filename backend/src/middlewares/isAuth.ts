import { NextFunction, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";

import { getAdminInfo } from "@/api/admin/utils";
import config from "@/config";
import { prisma } from "@/db";
import { CustomRequest } from "@/types";

export const isAuth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) throw createError(401, "Not Authenticated");
    const [, token] = authHeader.split(" ");
    const decodedToken = jwt.verify(token, config.JWT_SECRET_KEY) as {
      id?: string;
    };
    if (!decodedToken?.id) throw createError(401, "Not Authenticated");
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
      include: {
        Vendor: {
          include: {
            business: true,
          },
        },
        Consumer: true,
        SubAdmin: true,
        RootAdmin: true,
      },
    });
    if (!user) throw createError(401, "Not Authenticated");
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const isAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = getAdminInfo(req);
    if (!user) throw createError(401, "Not Authenticated");
    next();
  } catch (err) {
    next(err);
  }
};

export default isAuth;
