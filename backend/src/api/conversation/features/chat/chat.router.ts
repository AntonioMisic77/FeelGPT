import express from "express";

import { sendMessage } from "./chat.controller";

const chatRouter = express.Router();

chatRouter.post("/send", sendMessage);

export default chatRouter;