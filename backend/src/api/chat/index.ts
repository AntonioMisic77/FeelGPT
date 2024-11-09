import express from "express";
import { sendMessage, getReply } from "./chat.controller";

const chatRouter = express.Router();

chatRouter.post("/send", sendMessage);
chatRouter.get("/reply", getReply);

export default chatRouter;
