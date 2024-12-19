import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import {
  chatSystemPrompt,
  chatUserPrompt,
  chatUserHistoryPrompt,
} from "../../prompts";
import { ChatInfo } from "../../data";

import { ChatOpenAI } from "@langchain/openai";
import {} from "@langchain/core/dist/chat_history";
import {
  ChatMessagePromptTemplate,
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { ChatMessageDto } from "./chat.controller";
import { prisma } from "@/db";

/**
 * Generates a response from the LLM using Azure Inference.
 * @param {ChatInfo} chatInfo - The chat information containing the user's message and other details.
 * @returns {Promise<string>} - The response from the LLM.
 * @throws {Error} - Throws an error if the API returns an error.
 */
export const generateLLMResponseInference = async (chatInfo: ChatInfo) => {
  // Get the endpoint from environment variables
  const endpoint = process.env.AZURE_PHI_ENDPOINT ?? "";

  // Get the API key from environment variables
  const apiKey = process.env.AZURE_PHI_API_KEY ?? "";

  // Create a new client instance with the endpoint and API key
  const client = ModelClient(endpoint, new AzureKeyCredential(apiKey));

  // Define the messages to be sent to the LLM
  const messages = [
    { role: "system", content: chatSystemPrompt },
    { role: "user", content: chatInfo.message },
  ];

  // Send a POST request to the /chat/completions endpoint with the messages
  var response = await client.path("/chat/completions").post({
    body: {
      messages: messages,
    },
  });

  // Check if the response contains an error and throw an error if it does
  if ("error" in response.body) {
    throw new Error(`Error from API: ${response.body.error.message}`);
  }

  // Return the content of the first choice in the response
  return response.body.choices[0].message.content;
};

/**
 * Generates a response from the LLM using Langchain framework.
 * @param {ChatInfo} chatInfo - The chat information containing the user's message and other details.
 * @returns {Promise<string>} - The response from the LLM.
 * @throws {Error} - Throws an error if the LLM returns an error.
 */
export const generateLLMResponseLangchain = async (
  chatInfo: ChatInfo,
  chatHistory: ChatMessageDto[]
) => {
  // Get the endpoint from environment variables
  const endpoint = process.env.AZURE_PHI_ENDPOINT ?? "";

  // Get the API key from environment variables
  const apiKey = process.env.AZURE_PHI_API_KEY ?? "";

  // Customize the endpoint to be able to use the Langchain framework
  const phiOIendpoint = endpoint + "/v1";

  // Create a new ChatOpenAI model instance with the specified parameters
  const model = new ChatOpenAI(
    {
      model: "azureai",
      apiKey: apiKey,
      temperature: 0.2,
    },
    { baseURL: phiOIendpoint }
  );

  // Create a system message prompt template from the chat system prompt
  const system_message =
    SystemMessagePromptTemplate.fromTemplate(chatSystemPrompt);
  const user_message = ChatMessagePromptTemplate.fromTemplate(
    chatUserPrompt,
    "user"
  );

  // Create a chat prompt template from the system message and chat prompt
  const chatprompt = ChatPromptTemplate.fromMessages([
    system_message,
    ...chatHistory.map((message) => customizeHistoryMessage(message)),
    user_message,
  ]);

  console.log("Chat prompt: ", chatprompt);

  // Create a chain by piping the chat prompt template to the model
  const chain = chatprompt.pipe(model);

  // Define the input object with the chat information and emotions
  const input = {
    age: chatInfo.age,
    gender: chatInfo.gender,
    question: chatInfo.message,
    anger: chatInfo.emotions[0],
    disgust: chatInfo.emotions[1],
    fear: chatInfo.emotions[2],
    happines: chatInfo.emotions[3],
    sadness: chatInfo.emotions[4],
    surprise: chatInfo.emotions[5],
    neutral: chatInfo.emotions[6],
  };

  let response;

  // Try to invoke the chain with the input up to 2 times
  for (let i = 0; i < 2; i++) {
    console.log("Attempt: ", i);
    try {
      // Invoke the chain with the input and return the response content
      response = await chain.invoke(input);

      // Log the response content
      console.log("Response from LLM: ", response.content);
      return response.content;
    } catch (error: any) {
      console.log("Error from LLM: ", error);

      // If an error occurs on the second attempt, throw an error with the error message
      if (i == 1) {
        if (error.error && error.error.message) {
          throw new Error("Error from LLM: " + error.error.message);
        } else {
          throw new Error("Error from LLM: " + JSON.stringify(error));
        }
      }
      i++;
    }
  }
};

// Function which customizes the message to be used in the chat prompt

// TODO
//customize user and ai messages as you want. Maybe in last user message include the context  in a way that we add just most probable emotion and age with gender
// if message type is assistant, summaries the message and include it in the prompt
// roles: user, assistant

const customizeHistoryMessage = (message: ChatMessageDto) => {
  let content = message.content;

  if (message.messageType == "user") {
    content = chatUserHistoryPrompt.replace(
      "{strongest_emotion}",
      message.emotionalState || "neutral"
    );
  }

  return ChatMessagePromptTemplate.fromTemplate(content, message.messageType);
};

/**
 * Summarizes the last session's chat messages for a user.
 * @param {string} email - The email of the user whose last session will be summarized.
 * @returns {Promise<string>} - The summary of the last session.
 * @throws {Error} - Throws an error if the summary generation fails.
 */
export const generateSessionSummary = async (email: string) => {
  try {
    // Fetch the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("No user found with the given email.");
    }

    // Fetch the latest session for the user
    const lastSession = await prisma.session.findFirst({
      where: { userId: user.id },
      orderBy: { startTime: "desc" },
    });

    if (!lastSession) {
      throw new Error("No session found for the user.");
    }

    // Fetch all messages from the last session
    const chatMessages = await prisma.chatMessage.findMany({
      where: { sessionId: lastSession.id },
      orderBy: { timestamp: "asc" },
    });

    if (chatMessages.length === 0) {
      throw new Error("No messages found for the last session.");
    }

    // Prepare the chat messages for the LLM
    const messagePrompts = chatMessages.map((message) =>
      ChatMessagePromptTemplate.fromTemplate(
        message.content,
        message.messageType
      )
    );

    // System prompt to guide the LLM for summarization
    const systemMessage = SystemMessagePromptTemplate.fromTemplate(
      "You are an assistant tasked with summarizing conversations. Please provide a concise summary of the conversation based on the following messages. \n  " +
        "Focus on: Key topics discussed \n" +
        "Ensure the summary is no longer than 1-2 sentences. \n" +
        "Start the Summary with The Words: In the last Session we talked about ..."
    );

    // Create a chat prompt template
    const chatPrompt = ChatPromptTemplate.fromMessages([
      systemMessage,
      ...messagePrompts,
    ]);

    // LLM setup
    const endpoint = process.env.AZURE_PHI_ENDPOINT ?? "";
    const apiKey = process.env.AZURE_PHI_API_KEY ?? "";
    const phiOIendpoint = endpoint + "/v1";

    const model = new ChatOpenAI(
      {
        model: "azureai",
        apiKey: apiKey,
        temperature: 0.3,
      },
      { baseURL: phiOIendpoint }
    );

    // Chain to execute the LLM summarization
    const chain = chatPrompt.pipe(model);

    const input = {}; // No extra input required since we are summarizing the chat history

    // Invoke the chain and get the summary
    const response = await chain.invoke(input);

    console.log("Generated Summary:", response.content);
    return response.content;
  } catch (error) {
    console.error("Error generating session summary:", error);
    throw new Error("Failed to generate session summary.");
  }
};
