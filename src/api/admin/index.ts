import express from "express";

import { isAdmin, isAuth } from "@/middlewares";

import authRouter from "./features/auth/auth.router";
import subAdminRouter from "./features/subAdmin/subAdmin.router";
import vendorRouter from "./features/vendor/vendor.router";
import zoneRouter from "./features/zone/zone.router";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/sub-admin", isAuth, isAdmin, subAdminRouter);
router.use("/vendor", isAuth, isAdmin, vendorRouter);
router.use("/zone", isAuth, isAdmin, zoneRouter);

export default router;
