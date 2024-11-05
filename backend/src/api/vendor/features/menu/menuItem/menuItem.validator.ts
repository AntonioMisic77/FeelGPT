/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/prefer-default-export */
import { z } from "zod";

import {
  ID_VALIDATOR,
  NAME_VALIDATOR,
  DESCRIPTION_VALIDATOR,
  PRICE_VALIDATOR,
  IMAGE_URL_VALIDATOR,
} from "@/constants";

export const PostCreateMenuItemValidator = {
  body: z.object({
    name: NAME_VALIDATOR,
    description: DESCRIPTION_VALIDATOR,
    price: PRICE_VALIDATOR,
    menuCategoryId: ID_VALIDATOR,
    imageUrl: IMAGE_URL_VALIDATOR,
  }),
};

export const DeleteMenuItemValidator = {
  params: z.object({
    menuItemId: ID_VALIDATOR,
  }),
};

export const PutMenuItemValidator = {
  params: z.object({
    menuItemId: ID_VALIDATOR,
  }),
  body: z.object({
    name: NAME_VALIDATOR.optional(),
    description: DESCRIPTION_VALIDATOR.optional(),
    price: PRICE_VALIDATOR.optional(),
    imageUrl: IMAGE_URL_VALIDATOR.optional(),
    menuCategoryId: ID_VALIDATOR.optional(),
  }),
};

export const GetSingleMenuItemValidator = {
  params: z.object({
    menuItemId: ID_VALIDATOR,
  }),
};

export const GetAllMenuItemsForBusinessValidator = {
  params: z.object({
    businessId: ID_VALIDATOR,
  }),
};
