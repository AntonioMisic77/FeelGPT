import express from "express";

import { isAuth } from "@/middlewares";

import authRouter from "./features/auth/auth.router";
import notificationRouter from "./features/notification/notification.router";
import searchRouter from "./features/search/search.router";
import timelineRouter from "./features/timeline/timeline.router";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/search", isAuth, searchRouter);
router.use("/notification", isAuth, notificationRouter);
router.use("/timeline", isAuth, timelineRouter);

export default router;
