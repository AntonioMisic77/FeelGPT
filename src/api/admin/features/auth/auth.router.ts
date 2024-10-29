import express from "express";

import { isAuth } from "@/middlewares";

import { getAdminMe, postLoginAdmin } from "./auth.controller";

const router = express.Router();

router.post("/login", postLoginAdmin);
router.get("/me", isAuth, getAdminMe);

export default router;
