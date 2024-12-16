import express from "express";

import { getEmotions, sendMessage } from "./chat.controller";
import { isAuth } from "@/middlewares";

const chatRouter = express.Router();

chatRouter.post("/send", sendMessage);
chatRouter.get("/emotions", isAuth, getEmotions);


export default chatRouter;