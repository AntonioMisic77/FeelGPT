import express from "express";

import { createEndpoint } from "@/utils";

import adminRouter from "./admin";
import consumerRouter from "./consumer";
import userRouter from "./user";
import vendorRouter from "./vendor";

const router = express.Router();


router.get(
  "/",
  createEndpoint({}, async (req, res) => {
    res.json({
      result: "Hello World",
    });
  })
);

router.use("/consumer", consumerRouter);
router.use("/vendor", vendorRouter);
router.use("/admin", adminRouter);
router.use("/user", userRouter);

export { router as api };

export default router;
