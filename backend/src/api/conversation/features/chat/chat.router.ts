import express from "express";

import {
  deleteAllSessions,
  deleteSession,
  getEmotions,
  getEmotionsYear,
  getSessionMessages,
  getSessions,
  sendMessage,
} from "./chat.controller";
import { isAuth } from "@/middlewares";

const chatRouter = express.Router();

chatRouter.post("/send", sendMessage);
chatRouter.get("/emotions", isAuth, getEmotions);
chatRouter.get("/emotionsInAYear", isAuth, getEmotionsYear);
chatRouter.get("/sessions", isAuth, getSessions);
chatRouter.get("/sessions/:sessionId/messages", isAuth, getSessionMessages);
chatRouter.delete("/sessions/:sessionId", isAuth, deleteSession);
chatRouter.delete("/sessions", isAuth, deleteAllSessions);

export default chatRouter;
