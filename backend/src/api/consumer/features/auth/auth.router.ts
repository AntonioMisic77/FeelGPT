import express from "express";

import { isAuth } from "@/middlewares";

import {
  postRegisterConsumer,
  postLoginConsumer,
  getConsumerMe,
} from "./auth.controller";

const router = express.Router();

router.post("/register", postRegisterConsumer);
router.post("/login", postLoginConsumer);
router.get("/me", isAuth, getConsumerMe);

export default router;
