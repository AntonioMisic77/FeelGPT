import { Request, Response } from "express";
import {
  generateLLMResponseLangchain,
  generateSessionSummary,
} from "./chat.service";
import { PrismaClient } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { getUserIdFromToken } from "@/api/user/features/auth/auth.service";
import { createEndpoint, getUserInfo } from "@/utils";
import {
  deleteAllSessionsValidator,
  deleteSessionValidator,
  getEmotionsValidator,
  getSessionMessagesValidator,
  getSessionsValidator,
} from "./chat.validator";

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
 * Compares two dates under the following conditions:
 * 1. There are at least 24 hours between the dates OR
 * 2. The current date is after 5 AM and the provided date is either:
 *    - from the same day and before 5 AM, or
 *    - from the previous day and after 5 AM
 *
 * @param compareDate - The date to compare with the current date
 * @returns boolean - True if either condition is met
 */
function compareDates(compareDate: Date): boolean {
  const currentDate = new Date();

  // Condition 1: Check if at least 24 hours between dates
  const hoursDifference =
    (currentDate.getTime() - compareDate.getTime()) / (1000 * 60 * 60);
  const isMoreThan24Hours = hoursDifference >= 24;

  // Condition 2: Check the 5 AM rule
  const currentHour = currentDate.getHours();
  const compareHour = compareDate.getHours();
  const isCurrentAfter5AM = currentHour >= 5;

  // Get dates without time for day comparison
  const currentDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const compareDay = new Date(
    compareDate.getFullYear(),
    compareDate.getMonth(),
    compareDate.getDate()
  );

  // Calculate day difference
  const dayDifference =
    (currentDay.getTime() - compareDay.getTime()) / (1000 * 60 * 60 * 24);

  // Check if dates cross the morning threshold
  const isSameDay = dayDifference === 0;
  const isNextDay = dayDifference === 1;

  const isCrossingMorningThreshold =
    (isCurrentAfter5AM && isSameDay && compareHour < 5) || // Same day, before 5 AM
    (isCurrentAfter5AM && isNextDay && compareHour >= 5); // Previous day, after 5 AM

  // Return true if either condition is met
  return isMoreThan24Hours || isCrossingMorningThreshold;
}

/**
 * Gets or creates a session for a user based on a 5 AM daily cutoff time.
 *
 * - Creates new session if none exists
 * - Creates new session if current time is after 5 AM and latest session started before 5 AM
 * - Returns existing session if started after 5 AM on the same day
 * - Generates summary and closes old session before creating new one
 *
 * @param userId - The ID of the user to get/create a session for
 * @returns Promise<Session> - Existing active session or newly created one
 */
async function getOrCreateSession(userId: string): Promise<any> {
  const now = new Date();
  const todayAt5AM = new Date(now);
  todayAt5AM.setHours(5, 0, 0, 0);

  // Get the user's latest active session
  const latestSession = await prisma.session.findFirst({
    where: {
      userId,
      status: "active",
    },
    orderBy: { startTime: "desc" },
    include: {
      chatMessages: {
        orderBy: { timestamp: "desc" },
        take: 1,
      },
      user: true,
    },
  });

  // If no active session exists, create a new one
  if (!latestSession) {
    return prisma.session.create({
      data: {
        userId,
        sessionTitle: `Chat Session - ${now.toLocaleDateString()}`,
        sessionSummary: "Ongoing chat session",
        startTime: now,
        status: "active",
        interactionCount: 0,
      },
    });
  }

  const lastMessageTime = latestSession.startTime;

  // Check if we need to create a new session (current time is after 5am and session started before 5am)
  const needsNewSession = compareDates(lastMessageTime);

  if (needsNewSession) {
    try {
      // Generate summary for the old session
      const summary = await generateSessionSummary(latestSession.user.email);

      // Close the old session
      await prisma.session.update({
        where: { id: latestSession.id },
        data: {
          status: "completed",
          endTime: now,
          sessionSummary: summary as string,
        },
      });

      // Create new session
      return prisma.session.create({
        data: {
          userId,
          sessionTitle: `Chat Session - ${now.toLocaleDateString()}`,
          sessionSummary: "Ongoing chat session",
          startTime: now,
          status: "active",
          interactionCount: 0,
        },
      });
    } catch (error) {
      console.error("Error generating session summary:", error);

      // Close the session even if summary generation fails
      await prisma.session.update({
        where: { id: latestSession.id },
        data: {
          status: "completed",
          endTime: now,
          sessionSummary: "Session summary generation failed",
        },
      });

      // Create new session
      return prisma.session.create({
        data: {
          userId,
          sessionTitle: `Chat Session - ${now.toLocaleDateString()}`,
          sessionSummary: "Ongoing chat session",
          startTime: now,
          status: "active",
          interactionCount: 0,
        },
      });
    }
  }

  // Return existing session if it's still valid
  return latestSession;
}

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
  const emotions = emotionsName.map((name) => ({
    name,
    probability: emotion.filter((e) => e.dominant_emotion === name).length,
  }));

  console.log("Preprocessed emotion:", emotions);

  //Get the emotion with the highest probability

  let highest_probability_emotion = {
    name: "neutral",
    probability: 0,
  };

  if (emotions.length > 0) {
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

  // Get or create appropriate session

  const session = await getOrCreateSession(userId);

  try {
    // Retrieve existing chat history from MongoDB for the session
    const sessionId = session.id;
    const chatHistory = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: "asc" },
      take: 10,
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
          lte: endOfWeek, // Less than or equal to the end of the week
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
          lte: endOfYear, // Less than or equal to the end of the year
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

// Endpoint to get all Sessions for a user
export const getSessions = createEndpoint(
  getSessionsValidator,
  async (req, res) => {
    const { user } = getUserInfo(req);
    const { status } = req.query;

    try {
      const sessions = await prisma.session.findMany({
        where: {
          userId: user.id,
          ...(status ? { status: status as string } : {}),
        },
        include: {
          chatMessages: {
            select: {
              messageType: true,
              content: true,
              timestamp: true,
            },
            orderBy: {
              timestamp: "desc",
            },
            take: 1, // Get only the last message for preview
          },
        },
        orderBy: {
          startTime: "desc",
        },
      });

      console.log("sessions: ", sessions);
      res.json({
        result: sessions.map((session) => ({
          id: session.id,
          title: session.sessionTitle,
          summary: session.sessionSummary,
          status: session.status,
          startTime: session.startTime,
          endTime: session.endTime,
          interactionCount: session.interactionCount,
          lastMessage: session.chatMessages[0]?.content || null,
          lastMessageTime: session.chatMessages[0]?.timestamp || null,
        })),
      });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({
        result: "Failed to fetch sessions",
      });
    }
  }
);

export const getSessionMessages = createEndpoint(
  getSessionMessagesValidator,
  async (req, res) => {
    const { sessionId } = req.params;
    const { user } = getUserInfo(req);

    try {
      // First verify that the session belongs to the user
      const session = await prisma.session.findFirst({
        where: {
          id: sessionId,
          userId: user.id,
        },
      });

      if (!session) {
        res.status(404).json({
          result: "Session not found or unauthorized",
        });
        return;
      }

      // Get all messages for the session
      const messages = await prisma.chatMessage.findMany({
        where: {
          sessionId,
        },
        orderBy: {
          timestamp: "asc",
        },
        select: {
          id: true,
          content: true,
          messageType: true,
          timestamp: true,
          emotionalState: true,
          emotionsProbabilities: true,
          age: true,
          gender: true,
        },
      });

      res.json({
        result: {
          session,
          messages,
        },
      });
    } catch (error) {
      console.error("Error fetching session messages:", error);
      res.status(500).json({
        result: "Failed to fetch session messages",
      });
    }
  }
);

export const deleteSession = createEndpoint(
  deleteSessionValidator,
  async (req, res) => {
    const { sessionId } = req.params;
    const { user } = getUserInfo(req);

    try {
      // First, verify that the session belongs to the user
      const session = await prisma.session.findFirst({
        where: {
          id: sessionId,
          userId: user.id,
        },
      });

      if (!session) {
        // Instead of returning response directly, use res.json()
        res.status(404).json({
          result: "Session not found or unauthorized",
        });
        return; // Make sure to return after sending response
      }

      // Delete all chat messages associated with the session first
      await prisma.chatMessage.deleteMany({
        where: {
          sessionId: sessionId,
        },
      });

      // Then delete the session
      await prisma.session.delete({
        where: {
          id: sessionId,
        },
      });

      // Use res.json() instead of returning response
      res.json({
        result: "Session deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({
        result: "Failed to delete session",
      });
    }
  }
);

export const deleteAllSessions = createEndpoint(
  deleteAllSessionsValidator,
  async (req, res) => {
    const { user } = getUserInfo(req);

    try {
      // First, delete all chat messages for user's sessions
      await prisma.chatMessage.deleteMany({
        where: {
          session: {
            userId: user.id,
          },
        },
      });

      // Then delete all sessions
      await prisma.session.deleteMany({
        where: {
          userId: user.id,
        },
      });

      res.json({
        result: "All sessions deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting all sessions:", error);
      res.status(500).json({
        result: "Failed to delete all sessions",
      });
    }
  }
);
