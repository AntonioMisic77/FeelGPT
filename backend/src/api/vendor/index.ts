import express from "express";

import { isAuth } from "@/middlewares";

import authRouter from "./features/auth/auth.router";
import businessRouter from "./features/business/business.router";
import dealRouter from "./features/deals/deals.router";
import menuRouter from "./features/menu/menu.router";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/menu", isAuth, menuRouter);
router.use("/deals", isAuth, dealRouter);
router.use("/business", isAuth, businessRouter);

export default router;
