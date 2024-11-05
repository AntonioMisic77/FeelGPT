/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/prefer-default-export */
import { z } from "zod";

import { ID_VALIDATOR, NAME_VALIDATOR } from "@/constants";

export const PostCreateMenuCategoryValidator = {
  body: z.object({
    name: NAME_VALIDATOR,
  }),
};

export const GetAllMenuCategoriesValidator = {
  params: z.object({
    vendorId: ID_VALIDATOR,
  }),
};
