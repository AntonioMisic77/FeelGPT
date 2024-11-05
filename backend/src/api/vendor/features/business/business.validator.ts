// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/prefer-default-export */

import { z } from "zod";

import { ID_VALIDATOR } from "@/constants";

export const GetRatingInfoValidator = {
  params: z.object({
    businessId: ID_VALIDATOR,
  }),
};

