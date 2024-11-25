import ModelClient from "@azure-rest/ai-inference";
import {AzureKeyCredential} from "@azure/core-auth";
import {chatSystemPrompt, chatUserPrompt, chatUserHistoryPrompt } from "../../prompts";
import { ChatInfo } from "../../data";

import { ChatOpenAI } from "@langchain/openai";
import { } from "@langchain/core/dist/chat_history";
import { ChatMessagePromptTemplate, ChatPromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { ChatMessageDto } from "./chat.controller";

/**
 * Generates a response from the LLM using Azure Inference.
 * @param {ChatInfo} chatInfo - The chat information containing the user's message and other details.
 * @returns {Promise<string>} - The response from the LLM.
 * @throws {Error} - Throws an error if the API returns an error.
 */
export const generateLLMResponseInference = 
async (chatInfo: ChatInfo) => {

    // Get the endpoint from environment variables 
    const endpoint = process.env.AZURE_PHI_ENDPOINT ?? "";

    // Get the API key from environment variables 
    const apiKey = process.env.AZURE_PHI_API_KEY ?? "";

    // Create a new client instance with the endpoint and API key
    const client = ModelClient(
        endpoint,
        new AzureKeyCredential(apiKey)
    );

    // Define the messages to be sent to the LLM
    const messages = [
        {role : "system", content : chatSystemPrompt},
        {role : "user", content : chatInfo.message},
    ]

    // Send a POST request to the /chat/completions endpoint with the messages
    var response = await client.path("/chat/completions").post({
        body : {
            messages : messages
        }
    });

    // Check if the response contains an error and throw an error if it does
    if ('error' in response.body) {
        throw new Error(`Error from API: ${response.body.error.message}`);
    }

    // Return the content of the first choice in the response
    return response.body.choices[0].message.content;
}

/**
 * Generates a response from the LLM using Langchain framework.
 * @param {ChatInfo} chatInfo - The chat information containing the user's message and other details.
 * @returns {Promise<string>} - The response from the LLM.
 * @throws {Error} - Throws an error if the LLM returns an error.
 */
export const generateLLMResponseLangchain = 
async (chatInfo: ChatInfo, chatHistory: ChatMessageDto[]) => {
    // Get the endpoint from environment variables 
    const endpoint = process.env.AZURE_PHI_ENDPOINT ?? "";
    
    // Get the API key from environment variables
    const apiKey = process.env.AZURE_PHI_API_KEY ?? "";

    // Customize the endpoint to be able to use the Langchain framework
    const phiOIendpoint = endpoint + "/v1";

    // Create a new ChatOpenAI model instance with the specified parameters
    const model = new ChatOpenAI({
        model: "azureai",
        apiKey: apiKey,
        temperature: 0.8,
    },{ baseURL : phiOIendpoint });

    // Create a system message prompt template from the chat system prompt
    const system_message = SystemMessagePromptTemplate.fromTemplate(chatSystemPrompt);
    const user_message = ChatMessagePromptTemplate.fromTemplate(chatUserPrompt, "user");

    // Create a chat prompt template from the system message and chat prompt
    const chatprompt = ChatPromptTemplate.fromMessages([
            system_message,
            ...chatHistory.map((message) =>  customizeHistoryMessage(message)),
            user_message
    ]);

    console.log("Chat prompt: ", chatprompt);

    // Create a chain by piping the chat prompt template to the model
    const chain = chatprompt.pipe(model);

    // Define the input object with the chat information and emotions
    const input = {
        age : chatInfo.age,
        gender : chatInfo.gender,
        question : chatInfo.message,
        anger : chatInfo.emotions[0],
        disgust : chatInfo.emotions[1],
        fear : chatInfo.emotions[2],
        happines : chatInfo.emotions[3],
        sadness : chatInfo.emotions[4],                                            
        surprise : chatInfo.emotions[5],
        neutral : chatInfo.emotions[6],      
    }

    let response;

    // Try to invoke the chain with the input up to 2 times
    for(let i = 0;i < 2; i++){
        console.log("Attempt: ", i);
        try {
            // Invoke the chain with the input and return the response content
            response = await chain.invoke(input)
            
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
}


// Function which customizes the message to be used in the chat prompt

// TODO 
//customize user and ai messages as you want. Maybe in last user message include the context  in a way that we add just most probable emotion and age with gender
// if message type is assistant, summaries the message and include it in the prompt
// roles: user, assistant

const customizeHistoryMessage = (message: ChatMessageDto) => {
    let content = message.content;

    if(message.messageType == "user"){
       content = chatUserHistoryPrompt.replace("{strongest_emotion}", message.emotionalState);
    } 

    return ChatMessagePromptTemplate.fromTemplate(content, message.messageType);
}