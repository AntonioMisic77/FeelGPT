import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

export const notFound404 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(createError(404, `🔍 - Not Found - ${req.originalUrl}`));
};

export default notFound404;
