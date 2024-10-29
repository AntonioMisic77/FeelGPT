import express from "express";

import {
  postReportComment,
  postReportPost,
  postReportProfile,
} from "./report.controller";

const router = express.Router();

router.post("/post", postReportPost);
router.post("/profile", postReportProfile);
router.post("/comment", postReportComment);

export default router;
