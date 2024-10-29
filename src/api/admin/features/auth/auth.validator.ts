/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/prefer-default-export */
import { z } from "zod";

import { EMAIL_VALIDATOR, LOGIN_PASSWORD_VALIDATOR } from "@/constants";

export const PostLoginAdminValidator = {
  body: z.object({
    email: EMAIL_VALIDATOR,
    password: LOGIN_PASSWORD_VALIDATOR,
  }),
};
