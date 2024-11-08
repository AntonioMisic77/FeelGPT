import express from "express";

import { createEndpoint } from "@/utils";

import userRouter from "./user";

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
router.use("/conversation", userRouter);

export { router as api };

export default router;
