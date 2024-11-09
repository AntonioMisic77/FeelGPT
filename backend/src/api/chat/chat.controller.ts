import { Request, Response } from "express";

/**
 * Interface defining the structure of the request body.
 */
interface ChatRequestBody {
  message: string;
  emotion: string[];
  age: number;
  gender: number; // 1 = male, 0 = female
}

let replyMessage = "";

/**
 * Handles the received message and emotion data from the frontend.
 * @param req - Express request object containing the message and emotion data.
 * @param res - Express response object for sending the response back to the frontend.
 */
export const sendMessage = (
  req: Request<{}, {}, ChatRequestBody>,
  res: Response
) => {
  const { message, emotion, age, gender } = req.body;

  // Validate the request data
  if (!message || !emotion) {
    return res.status(400).json({ error: "Message and emotion are required." });
  }

  console.log("Received message:", message);
  console.log("Detected emotion:", emotion);
  console.log("Received age:", age);
  console.log("Detected gender:", gender);

  // success reply to frontend
  res
    .status(200)
    .json({ status: "success", reply: "Message received successfully" });
};

/**
 * Returns the generated reply message to the frontend.
 * @param req - Express request object.
 * @param res - Express response object for sending the reply.
 */
export const getReply = (req: Request, res: Response) => {
  if (!replyMessage) {
    return res.status(404).json({ error: "No reply available." });
  }

  // Send the reply message to the frontend
  res.status(200).json({ status: "success", reply: replyMessage });
};
