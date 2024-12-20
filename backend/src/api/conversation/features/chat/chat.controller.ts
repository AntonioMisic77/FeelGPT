import { Request, Response } from "express";
import { generateLLMResponseLangchain } from "./chat.service";
import { PrismaClient } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { getUserIdFromToken } from "@/api/user/features/auth/auth.service";
import { createEndpoint, getUserInfo } from "@/utils";
import { getEmotionsValidator } from "./chat.validator";

/**
 * Interface defining the structure of the request body.
 */

type Emotion = {
  dominant_emotion: string;
};

interface ChatRequestBody {
  message: string;
  emotion: Emotion[];
  age: number;
  gender: number; // 1 = male, 0 = female
}

export interface ChatMessageDto {
  messageType: string;
  content: string;
  emotionalState: string | null;
  emotionsProbabilities: number[] | null | JsonValue;
  age: number | null;
  gender: string | null;
}

const prisma = new PrismaClient(); // Initialize Prisma client

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

  const header = req.headers.authorization;

  console.log("Received headers", req.headers);

  if (!header) {
      return res.status(401).json({ error: "Unauthorized" });
  }

  const jwtToken = header.split(" ")[1];

  const userId = getUserIdFromToken(jwtToken);

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

  // // Map the received emotions to an array of objects with name and probability
  // const emotions = emotion.map((e, i) => ({
  //   name: emotionsName[i],
  //   probability: +e || 0,
  // }));

  // Map each emotion to a count
  const emotions = emotionsName.map(name => ({
    name,
    probability: emotion.filter(e => e.dominant_emotion === name).length,
  }));

  console.log("Preprocessed emotion:", emotions);

  //Get the emotion with the highest probability

  let highest_probability_emotion = {
    name: "neutral",
    probability: 0
  }

  if(emotions.length > 0) {
      highest_probability_emotion = emotions.reduce((prev, current) =>
        prev.probability > current.probability ? prev : current
      );
  }

  const chatInfo = {
    message: message,
    age: age,
    emotions: emotions,
    gender: gender === 0 ? "female" : "male",
  };

  let session = await prisma.session.findFirst({
    where : {userId: userId}
  })

  if (!session) {
    session = await prisma.session.create({
      data: {
        userId: userId,
        sessionTitle : "Session Title",
        sessionSummary : "Session Summary",
        interactionCount : 0,
        startTime : new Date(),
        status : "active"
      }
    })
  }
    

  try {
    // Retrieve existing chat history from MongoDB for the session
    const sessionId = session.id;
    const chatHistory = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: "asc" },
      take : 10
    });

    console.log("Chat history:", chatHistory);

    // Generate the LLM response
    const llmResponse = await generateLLMResponseLangchain(
      chatInfo,
      chatHistory
    );

    // Save user's message to the database
    await prisma.chatMessage.create({
      data: {
        sessionId,
        userId: userId, // Replace with actual user ID if available
        messageType: "user",
        content: message,
        emotionalState: highest_probability_emotion.name,
        emotionsProbabilities: emotions.map((e) => e.probability),
        age: age,
        gender: gender === 0 ? "female" : "male",
        additionalInformation: null,
        timestamp: new Date(),
      },
    });

    // Save assistant's message to the database
    await prisma.chatMessage.create({
      data: {
        sessionId,
        userId: userId,
        messageType: "assistant",
        content: (llmResponse as string) || "I can't help you with that.",
        emotionalState: null,
        emotionsProbabilities: null,
        age: null,
        gender: null,
        additionalInformation: null,
        timestamp: new Date(),
      },
    });

    // Send the response back to the frontend
    res.status(200).json({
      status: "success",
      reply: llmResponse || "I can't help you with that.",
    });
  } catch (error: any) {
    console.error("Error handling chat message:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getEmotions = createEndpoint(
  getEmotionsValidator,
  async (req, res) => {
    // Extract the userId and date from the request
    const { date } = req.query;
    const { user } = getUserInfo(req);

    // Parse the date from the request and calculate the start of the week
    const selectedDate = new Date(date as string);

    if (isNaN(selectedDate.getTime())) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    // Determine the start and end of the current week
    const dayOfWeek = selectedDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - dayOfWeek); // Go back to the previous Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Go forward to the following Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    // Query messages for the specific user and the week
    const messages = await prisma.chatMessage.findMany({
      where: {
        userId: user.id,
        timestamp: {
          gte: startOfWeek, // Greater than or equal to the start of the week
          lte: endOfWeek,   // Less than or equal to the end of the week
        },
      },
      select: {
        id: true, // Include the message ID for reference
        timestamp: true, // Include the timestamp for context
        emotionsProbabilities: true, // Include only the emotional probabilities
      },
    });

    // Respond with the data
    res.json({
      result: messages,
    });
  }
);


export const getEmotionsYear = createEndpoint(
  getEmotionsValidator,
  async (req, res) => {
    // Extract the userId and date from the request
    const { date } = req.query;
    const { user } = getUserInfo(req);

    // Parse the date from the request and calculate the start of the year
    const selectedDate = new Date(date as string);

    if (isNaN(selectedDate.getTime())) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    // Determine the start and end of the current year
    const startOfYear = new Date(selectedDate.getFullYear(), 0, 1); // January 1st
    startOfYear.setHours(0, 0, 0, 0);

    const endOfYear = new Date(selectedDate.getFullYear(), 11, 31); // December 31st
    endOfYear.setHours(23, 59, 59, 999);

    // Query messages for the specific user and the year
    const messages = await prisma.chatMessage.findMany({
      where: {
        userId: user.id,
        timestamp: {
          gte: startOfYear, // Greater than or equal to the start of the year
          lte: endOfYear,   // Less than or equal to the end of the year
        },
      },
      select: {
        id: true, // Include the message ID for reference
        timestamp: true, // Include the timestamp for context
        emotionsProbabilities: true, // Include only the emotional probabilities
      },
    });

    // Respond with the data
    res.json({
      result: messages,
    });
  }
);

