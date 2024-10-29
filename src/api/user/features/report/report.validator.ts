import { z } from "zod";

import { ID_VALIDATOR } from "@/constants";

const REASON_VALIDATOR = z.string().trim().min(1).max(255);

export const PostReportPostValidator = {
  body: z.object({
    reportedAgainst: ID_VALIDATOR,
    reason: REASON_VALIDATOR,
  }),
};
export const PostReportProfileValidator = {
  body: z.object({
    reportedAgainst: ID_VALIDATOR,
    reason: REASON_VALIDATOR,
  }),
};
export const PostReportCommentValidator = {
  body: z.object({
    reportedAgainst: ID_VALIDATOR,
    reason: REASON_VALIDATOR,
  }),
};
