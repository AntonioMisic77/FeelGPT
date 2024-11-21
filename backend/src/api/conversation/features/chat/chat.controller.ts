import { Request, Response } from "express";
import { generateLLMResponseLangchain } from "./chat.service";
import { get } from "http";

/**
 * Interface defining the structure of the request body.
 */
interface ChatRequestBody {
  message: string;
  emotion: string[];
  age: number;
  gender: number; // 1 = male, 0 = female
}

export interface ChatMessageDto {
  messageType: string;
  content: string;
  emotionalState: string;
  emotionsProbabilities: number[];
  age: number;
  gender: string;
}


const chatHistory : ChatMessageDto[] = [];


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
  const { message, emotion, age, gender } = req.body;

  // Validate the request data
  if (!message || !emotion) {
    return res.status(400).json({ error: "Message and emotion are required." });
  }

  // Log the received data
  console.log("Received message:", message);
  console.log("Detected emotion:", emotion);
  console.log("Received age:", age);
  console.log("Detected gender:", gender);

  const emotionsName = [
    "anger",
    "disgust",
    "fear",
    "happiness",
    "sadness",
    "surprise",
    "neutral",
  ];

  // Map the received emotions to an array of objects with name and probability
  const emotions = emotion.map((e, i) => ({
    name: emotionsName[i],
    probability: +e || 0,
  }));

  // Get the emotion with the highest probability
  const highest_probability_emotion = emotions.reduce((prev, current) =>
    prev.probability > current.probability ? prev : current
  );

  const chatInfo = {
    message: message,
    age: age,
    emotions : emotions,
    gender: gender == 0 ? "female" : "male"
  }

  // TODO - Replace the dummy history with the actual chat history from mongodb
  const dummy_history = chatHistory;

  let llmResponse;
  try {
    // Generate a response from the LLM using the chatInfo object
    llmResponse = await generateLLMResponseLangchain(chatInfo,dummy_history);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }

  if (!llmResponse) {
    llmResponse = "I can't help you with that.";
  }

  // Find the emotion with the highest probability
  const highest_probability_emotion = emotions.reduce((prev, current) => (prev.probability > current.probability) ? prev : current);

  // TODO
  // store the chat history in mongodb not in memory

  chatHistory.push({
      messageType: "user",
      content: message,
      emotionalState: highest_probability_emotion.name,
      emotionsProbabilities: emotions.map(e => e.probability),
      age: age,
      gender: gender == 0 ? "female" : "male"
  });

  chatHistory.push({
      messageType: "assistant",
      content: llmResponse.toString(),
      emotionalState: highest_probability_emotion.name,
      emotionsProbabilities: emotions.map(e => e.probability),
      age: age,
      gender: gender == 0 ? "female" : "male"
  });
  
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

