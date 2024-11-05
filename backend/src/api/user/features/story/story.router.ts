import express from "express";

import {
  getAllStoriesByUserId,
  postCreateStory,
  postViewStory,
} from "./story.controller";

const router = express.Router();

router.post("/create", postCreateStory);
router.get("/all/:userId", getAllStoriesByUserId);
router.post("/view/:storyId", postViewStory);

export default router;
