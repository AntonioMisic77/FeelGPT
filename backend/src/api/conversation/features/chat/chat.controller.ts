import { Request, Response } from "express";
import { generateLLMResponseLangchain } from "./chat.service";

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
export const sendMessage = async (
  req: Request<{}, {}, ChatRequestBody>,
  res: Response
) => {
  // Extract message, emotion, age, and gender from the request body
  const { message, emotion, age, gender } = req.body;

  // Validate the request data
  if (!message || !emotion) {
    return res.status(400).json({ error: "Message and emotion are required." });
  }

  // Log the received message, emotion, age, and gender
  console.log("Received message:", message);
  console.log("Detected emotion:", emotion);
  console.log("Received age:", age);
  console.log("Detected gender:", gender);

  // Define the names of the emotions
  const emotionsName = ["anger", "disgust", "fear", "happiness", "sadness", "surprise", "neutral"];

  // Map the received emotions to an array of objects with name and probability
  const emotions = emotion.map((e, i) => ({ name: emotionsName[i], probability: +e || 0 }));

  // Create a chatInfo object with the message, age, emotions, and gender
  const chatInfo = {
    message: message,
    age: age,
    emotions : emotions,
    gender: gender == 0 ? "female" : "male"
  }

  let llmResponse;
  try {
    // Generate a response from the LLM using the chatInfo object
    llmResponse = await generateLLMResponseLangchain(chatInfo);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
  
  // Send a success reply to the frontend with the LLM response
  res
    .status(200)
    .json({ status: "success", reply: llmResponse || "I can't help you with that." });
};

/**
 * Returns the generated reply message to the frontend.
 * @param req - Express request object.
 * @param res - Express response object for sending the reply.
 */
export const getReply = (req: Request, res: Response) => {
  // Check if there is a reply message available
  if (!replyMessage) {
    return res.status(404).json({ error: "No reply available." });
  }

  // Send the reply message to the frontend
  res.status(200).json({ status: "success", reply: replyMessage });
};
