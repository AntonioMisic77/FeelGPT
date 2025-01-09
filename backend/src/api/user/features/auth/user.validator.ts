import { DATETIME_VALIDATOR, EMAIL_VALIDATOR, NAME_VALIDATOR, PASSWORD_VALIDATOR } from "@/constants";
import { z } from "zod";
import {NotificationFrequency, NotificationMode, ResponseTone, DayOfWeek} from "@prisma/client";

export const UpdateUserInfoValidator = {
  body: z
    .object({
      email: EMAIL_VALIDATOR.optional(),
      username: NAME_VALIDATOR.optional(),
      notificationFrequency: z.nativeEnum(NotificationFrequency).optional(),
      notificationMode: z.nativeEnum(NotificationMode).optional(),
      notificationDayOfWeek: z.nativeEnum(DayOfWeek).optional(),
      notificationTime: DATETIME_VALIDATOR.optional(),
      responseTone: z.nativeEnum(ResponseTone).optional(),
    })
    .refine(
      (data) => {
        if (
          data.notificationFrequency === "WEEKLY" &&
          data.notificationDayOfWeek == null
        ) {
          return false; // If WEEKLY, ensure notificationDayOfWeek is provided
        }
        return true;
      },
      {
        message:
          "Please specify a valid day of the week for weekly notifications.",
        path: ["notificationDayOfWeek"], // Attach the error to the correct field
      }
    ),
};


export const ForgotPasswordValidator = {
  body: z.object({
    email: EMAIL_VALIDATOR,})
};

export const ResetPasswordValidator = {
  body: z.object({
    email: EMAIL_VALIDATOR,
    newPassword: PASSWORD_VALIDATOR,
    token: z.string(),
  
  })
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
      imageExtension : z.string(),
      notificationDayOfWeek: z.nativeEnum(DayOfWeek).optional(),

    }).refine(
      (data) => {
        if (
          data.notificationFrequency === "WEEKLY" &&
          data.notificationDayOfWeek == null
        ) {
          return false; // If WEEKLY, ensure notificationDayOfWeek is provided
        }
        return true;
      },
      {
        message:
          "Please specify a valid day of the week for weekly notifications.",
        path: ["notificationDayOfWeek"], // Attach the error to the correct field
      }
    ),
  };

  export const LoginUserValidator = {
    body: z.object({
      email: EMAIL_VALIDATOR,
      password: PASSWORD_VALIDATOR,
    }),
  };