import { DATETIME_VALIDATOR } from "@/constants";
import { z } from "zod";

export const getEmotionsValidator = {
  query: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in the format YYYY-MM-DD"), // Enforce format
  }),
};

export const getSessionsValidator = {
  query: z.object({
    status: z.enum(["active", "completed"]).optional(),
  }),
};

export const getSessionMessagesValidator = {
  params: z.object({
    sessionId: z.string(),
  }),
};

export const deleteSessionValidator = {
  params: z.object({
    sessionId: z.string(),
  }),
};

export const deleteAllSessionsValidator = {
  query: z.object({}),
};
