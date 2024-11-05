import {
  AvailabilitiesDay,
  FoodServicesType,
  PaymentServicesType,
  UsersGender,
} from "@prisma/client";
import { z } from "zod";

import {
  CNIC_VALIDATOR,
  NAME_VALIDATOR,
  LOGIN_PASSWORD_VALIDATOR,
  PHONE_NUMBER_VALIDATOR,
  REGISTER_PASSWORD_VALIDATOR,
  URL_VALIDATOR,
} from "@/constants";

const AvailabilityValidator = z.object({
  day: z.nativeEnum(AvailabilitiesDay),
  opensAt: z.string().trim().min(1),
  closesAt: z.string().trim().min(1),
});

export const PostRegisterVendorValidator = {
  body: z.object({
    userInfo: z.object({
      firstName: NAME_VALIDATOR,
      lastName: NAME_VALIDATOR,
      phoneNumber: PHONE_NUMBER_VALIDATOR,
      gender: z.nativeEnum(UsersGender),
      cnic: CNIC_VALIDATOR,
      password: REGISTER_PASSWORD_VALIDATOR,
      avatarUrl: URL_VALIDATOR,
    }),
    businessInfo: z.object({
      name: NAME_VALIDATOR,
      country: z.string().min(1).trim(),
      province: z.string().min(1).trim(),
      city: z.string().min(1).trim(),
      descriptiveAddress: z.string().min(1).trim(),
      phoneNumber: PHONE_NUMBER_VALIDATOR,
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      foodServices: z
        .array(z.nativeEnum(FoodServicesType))
        .transform((foodServices) =>
          foodServices.map((foodService) => ({ type: foodService }))
        ),
      paymentServices: z
        .array(z.nativeEnum(PaymentServicesType))
        .transform((paymentServices) =>
          paymentServices.map((paymentService) => ({
            type: paymentService,
          }))
        ),
      availabilities: z.array(AvailabilityValidator),
    }),
  }),
};

export const PostLoginVendorValidator = {
  body: z.object({
    cnic: CNIC_VALIDATOR,
    password: LOGIN_PASSWORD_VALIDATOR,
  }),
};
