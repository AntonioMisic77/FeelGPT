import express from "express";

import { getUserNotifications } from "./notification.controller";

const router = express.Router();

router.get("/", getUserNotifications);

export default router;
