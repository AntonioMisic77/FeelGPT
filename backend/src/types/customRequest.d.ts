/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import * as core from "express-serve-static-core";

interface CustomQuery {
  [key: string]:
    | undefined
    | string
    | string[]
    | CustomQuery
    | CustomQuery[]
    | number
    | number[]
    | boolean
    | boolean[];
}

export interface CustomRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = CustomQuery,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: any;
}

export default CustomRequest;
