import express from "express";

import chatRouter from "./features/chat/chat.router";

const router = express.Router();

router.use("/chat", chatRouter);

export default router;