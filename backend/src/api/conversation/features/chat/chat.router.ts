import express from "express";

import { getEmotions,getEmotionsYear, sendMessage } from "./chat.controller";
import { isAuth } from "@/middlewares";

const chatRouter = express.Router();

chatRouter.post("/send", sendMessage);
chatRouter.get("/emotions", isAuth, getEmotions);
chatRouter.get("/emotionsInAYear", isAuth, getEmotionsYear);

export default chatRouter;