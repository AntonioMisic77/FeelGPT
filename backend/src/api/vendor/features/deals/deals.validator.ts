/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/prefer-default-export */
import { z } from "zod";

import {
  DESCRIPTION_VALIDATOR,
  ID_VALIDATOR,
  IMAGE_URL_VALIDATOR,
  NAME_VALIDATOR,
  PRICE_VALIDATOR,
} from "@/constants";

export const PostCreateDealValidator = {
  body: z.object({
    name: NAME_VALIDATOR,
    description: DESCRIPTION_VALIDATOR,
    price: PRICE_VALIDATOR,
    imageUrl: IMAGE_URL_VALIDATOR,
    menuItems: z
      .array(
        z.object({
          menuItemId: ID_VALIDATOR,
          quantity: z.number().min(1),
        })
      )
      .min(1),
  }),
};

export const GetAllDealsValidator = {
  params: z.object({
    vendorId: ID_VALIDATOR,
  }),
};

export const GetSingleDealValidator = {
  params: z.object({
    dealId: ID_VALIDATOR,
  }),
};

export const DeleteDealValidator = {
  params: z.object({
    dealId: ID_VALIDATOR,
  }),
};
