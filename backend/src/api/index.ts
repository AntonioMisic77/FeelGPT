import express from "express";

import { createEndpoint } from "@/utils";

import userRouter from "./user";
import chatRouter from "./chat";

const router = express.Router();

router.get(
  "/",
  createEndpoint({}, async (req, res) => {
    res.json({
      result: "Hello World",
    });
  })
);

router.use("/user", userRouter);
router.use("/notification", userRouter);
router.use("/chat", chatRouter);

export { router as api };

export default router;
