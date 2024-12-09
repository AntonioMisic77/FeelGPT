import { NextFunction, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
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
      userId?: string;
    };
    if (!decodedToken?.userId) throw createError(401, "Not Authenticated");
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId }
    });
    if (!user) throw createError(401, "Not Authenticated");
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};



export default isAuth;
