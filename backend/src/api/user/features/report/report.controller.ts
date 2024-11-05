import { prisma } from "@/db";
import { createEndpoint, getUserInfo } from "@/utils";

import {
  PostReportCommentValidator,
  PostReportPostValidator,
  PostReportProfileValidator,
} from "./report.validator";

export const postReportPost = createEndpoint(
  PostReportPostValidator,
  async (req, res) => {
    const { user } = getUserInfo(req);
    const { reportedAgainst, reason } = req.body;

    const report = await prisma.postReport.create({
      data: {
        reportedAgainst,
        reason,
        reportedBy: user.id,
      },
    });

    res.json({
      result: report,
    });
  }
);

export const postReportProfile = createEndpoint(
  PostReportProfileValidator,
  async (req, res) => {
    const { user } = getUserInfo(req);
    const { reportedAgainst, reason } = req.body;

    const report = await prisma.profileReport.create({
      data: {
        reportedAgainst,
        reason,
        reportedBy: user.id,
      },
    });

    res.json({
      result: report,
    });
  }
);

export const postReportComment = createEndpoint(
  PostReportCommentValidator,
  async (req, res) => {
    const { user } = getUserInfo(req);
    const { reportedAgainst, reason } = req.body;

    const report = await prisma.commentReport.create({
      data: {
        reportedAgainst,
        reason,
        reportedBy: user.id,
      },
    });

    res.json({
      result: report,
    });
  }
);
