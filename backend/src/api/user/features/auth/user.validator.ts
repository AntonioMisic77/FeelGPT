import { DATETIME_VALIDATOR, EMAIL_VALIDATOR, NAME_VALIDATOR } from "@/constants";
import { z } from "zod";
import {NotificationFrequency, NotificationMode, ResponseTone} from "@prisma/client";

export const UpdateUserInfoValidator = {
    body: z.object({
      email: EMAIL_VALIDATOR.optional(),
      username: NAME_VALIDATOR.optional(),
      notificationFrequency: z.nativeEnum(NotificationFrequency).optional(),
      notificationMode: z.nativeEnum(NotificationMode).optional(),
      notificationTime: DATETIME_VALIDATOR.optional(),
      responseTone: z.nativeEnum(ResponseTone)
    }),
  };