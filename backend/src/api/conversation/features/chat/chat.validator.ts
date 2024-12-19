import { DATETIME_VALIDATOR } from "@/constants";
import { z } from "zod";

  export const getEmotionsValidator = {
    query: z.object({
      date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in the format YYYY-MM-DD"), // Enforce format
    })
  };