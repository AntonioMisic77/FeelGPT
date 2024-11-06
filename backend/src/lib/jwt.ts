// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/prefer-default-export */
import jwt from "jsonwebtoken";

import config from "@/config";

export const jwtSign = (payload: string | object | Buffer) =>
  jwt.sign(payload, config.JWT_SECRET_KEY, {
    algorithm: "HS256",
  });
