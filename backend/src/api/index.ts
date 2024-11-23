import express from "express";

import { createEndpoint } from "@/utils";

import userRouter from "./user";
import notificationRouter from "./notification";
import conversationRouter from "./conversation";


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
router.use("/notification", notificationRouter);
router.use("/conversation", conversationRouter);
export { router as api };

export default router;
