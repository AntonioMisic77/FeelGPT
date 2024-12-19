import { DATETIME_VALIDATOR, EMAIL_VALIDATOR, NAME_VALIDATOR, PASSWORD_VALIDATOR } from "@/constants";
import { z } from "zod";
import {NotificationFrequency, NotificationMode, ResponseTone} from "@prisma/client";

export const UpdateUserInfoValidator = {
    body: z.object({
      email: EMAIL_VALIDATOR.optional(),
      username: NAME_VALIDATOR.optional(),
      notificationFrequency: z.nativeEnum(NotificationFrequency).optional(),
      notificationMode: z.nativeEnum(NotificationMode).optional(),
      notificationTime: DATETIME_VALIDATOR.optional(),
      responseTone: z.nativeEnum(ResponseTone).optional()
    }),
  };

  export const RegisterUserValidator = {
    body: z.object({
      email: EMAIL_VALIDATOR,
      password: PASSWORD_VALIDATOR,
      username: NAME_VALIDATOR.optional(),
      notificationFrequency: z.nativeEnum(NotificationFrequency).optional(),
      notificationMode: z.nativeEnum(NotificationMode).optional(),
      notificationTime: DATETIME_VALIDATOR.optional(),
      responseTone: z.nativeEnum(ResponseTone).optional(),
      profileImage: z.string(),
      imageExtension : z.string()
    }),
  };

  export const LoginUserValidator = {
    body: z.object({
      email: EMAIL_VALIDATOR,
      password: PASSWORD_VALIDATOR,
    }),
  };