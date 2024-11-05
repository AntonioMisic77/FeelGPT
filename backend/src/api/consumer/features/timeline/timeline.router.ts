import express from "express";

import {
  getUserTimelinePosts,
  getUserTimelineStories,
} from "./timeline.controller";

const router = express.Router();

router.get("/posts", getUserTimelinePosts);
router.get("/stories", getUserTimelineStories);

export default router;
