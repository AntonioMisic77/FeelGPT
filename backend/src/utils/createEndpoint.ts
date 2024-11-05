// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import { CustomRequest } from "@/types";

interface SchemaValidator {
  body?: z.Schema;
  query?: z.Schema;
  params?: z.Schema;
}

interface ResponseBody {
  result: unknown;
}

interface EndpointCallback<T extends SchemaValidator> {
  (
    req: CustomRequest<
      T["params"] extends z.Schema ? z.infer<T["params"]> : any,
      ResponseBody,
      T["body"] extends z.Schema ? z.infer<T["body"]> : any,
      T["query"] extends z.Schema ? z.infer<T["query"]> : any
    >,
    res: Response<ResponseBody>,
    next?: NextFunction
  ): Promise<void> | void;
}

export const createEndpoint =
  <T extends SchemaValidator>(schema: T, callback: EndpointCallback<T>) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (schema.body) req.body = schema.body.parse(req.body);
      if (schema.query) req.query = schema.query.parse(req.query);
      if (schema.params) req.params = schema.params.parse(req.params);
      await callback(req as any, res, next);
    } catch (err) {
      // if error is zod error, convert it to http error in a readable format
      if (err instanceof z.ZodError)
        next(
          createHttpError(
            400,
            fromZodError(err, {
              prefix: "",
              prefixSeparator: "",
            })
          )
        );
      else next(err);
    }
  };

export default createEndpoint;
