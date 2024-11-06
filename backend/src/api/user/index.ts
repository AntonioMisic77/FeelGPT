import express from "express";

import { isAuth } from "@/middlewares";

import commentRouter from "./features/comment/comment.router";
import followRouter from "./features/follow/follow.router";
import postRouter from "./features/post/post.router";
import reportRouter from "./features/report/report.router";
import storyRouter from "./features/story/story.router";

const router = express.Router();

router.use("/post", isAuth, postRouter);
router.use("/comment", isAuth, commentRouter);
router.use("/follow", isAuth, followRouter);
router.use("/report", isAuth, reportRouter);
router.use("/story", isAuth, storyRouter);

export default router;
