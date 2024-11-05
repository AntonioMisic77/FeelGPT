import express from "express";

import { isAuth } from "@/middlewares";

import { postRegisterVendor, postLoginVendor, getVendorMe } from "./auth.controller";

const router = express.Router();

router.post("/register", postRegisterVendor);
router.post("/login", postLoginVendor);
router.get("/me",isAuth, getVendorMe);

export default router;
