import { UsersGender } from "@prisma/client";
import { z } from "zod";

import {
  EMAIL_VALIDATOR,
  LOGIN_PASSWORD_VALIDATOR,
  NAME_VALIDATOR,
  PHONE_NUMBER_VALIDATOR,
  REGISTER_PASSWORD_VALIDATOR,
  URL_VALIDATOR,
} from "@/constants";

export const PostRegisterConsumerValidator = {
  body: z.object({
    email: EMAIL_VALIDATOR,
    password: REGISTER_PASSWORD_VALIDATOR,
    username: NAME_VALIDATOR,
    firstName: NAME_VALIDATOR,
    lastName: NAME_VALIDATOR,
    phoneNumber: PHONE_NUMBER_VALIDATOR,
    avatarUrl: URL_VALIDATOR,
    bio: z.string().trim().min(1),
    gender: z.nativeEnum(UsersGender),
  }),
};

export const PostLoginConsumerValidator = {
  body: z.object({
    email: EMAIL_VALIDATOR,
    password: LOGIN_PASSWORD_VALIDATOR,
  }),
};
