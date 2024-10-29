import { z } from "zod";

import { ID_VALIDATOR, NAME_VALIDATOR } from "@/constants";

const SINGLE_CORD_VALIDATOR = z.coerce.number();

export const GetSearchBusinessValidator = {
  query: z
    .object({
      name: NAME_VALIDATOR.optional(),
      latitude: SINGLE_CORD_VALIDATOR.optional(),
      longitude: SINGLE_CORD_VALIDATOR.optional(),
    })
    .refine((data) => {
      if (
        data.name !== undefined &&
        (data.latitude === undefined || data.longitude === undefined)
      ) {
        return false;
      }
      return true;
    }, "Latitude and longitude are required"),
};

export const GetNearbyBusinessesValidator = {
  query: z.object({
    radiusInKm: SINGLE_CORD_VALIDATOR.positive(),
    latitude: SINGLE_CORD_VALIDATOR,
    longitude: SINGLE_CORD_VALIDATOR,
  }),
};

export const GetSearchConsumerValidator = {
  query: z.object({
    name: NAME_VALIDATOR.optional(),
  }),
};

export const GetSearchItemValidator = {
  query: z
    .object({
      name: NAME_VALIDATOR.optional(),
      latitude: SINGLE_CORD_VALIDATOR.optional(),
      longitude: SINGLE_CORD_VALIDATOR.optional(),
    })
    .refine((data) => {
      if (
        data.name !== undefined &&
        (data.latitude === undefined || data.longitude === undefined)
      ) {
        return false;
      }
      return true;
    }, "Latitude and longitude are required"),
};

export const GetConsumerByUserIdValidator = {
  params: z.object({
    userId: ID_VALIDATOR,
  }),
};

export const GetVendorByUserIdValidator = {
  params: z.object({
    userId: ID_VALIDATOR,
  }),
};
