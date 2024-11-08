
import ModelClient from "@azure-rest/ai-inference";
import {AzureKeyCredential} from "@azure/core-auth";
import { ChatInfo,chatSystemPrompt, chatPrompt } from "../models";

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, PromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";

export class ChatService{

    constructor() {}

    async chatInference(chatInfo: ChatInfo) {

        const endpoint = process.env.AZURE_PHI_ENDPOINT ?? "";
        const apiKey = process.env.AZURE_PHI_API_KEY ?? "";

        var client = ModelClient(
            endpoint,
            new AzureKeyCredential(apiKey)
        );

        var messages = [
            {role : "system", content : chatSystemPrompt},
            {role : "user", content : chatInfo.message},
        ]

        var response = await client.path("/chat/completions").post({
            body : {
                messages : messages
            }
        });

        if ('error' in response.body) {
            throw new Error(`Error from API: ${response.body.error.message}`);
        }

        return response.body.choices[0].message.content;
    }


    async chatLangchain(chatInfo: ChatInfo)
    {
        const endpoint = process.env.AZURE_PHI_ENDPOINT ?? "";
        const apiKey = process.env.AZURE_PHI_API_KEY ?? "";

        // customize the endpoint to be able to use the Langchain framework
        const phiOIendpoint = endpoint + "/v1";

        const model = new ChatOpenAI({
            model: "azureai",
            apiKey: apiKey,
        },{ baseURL : phiOIendpoint });

       const message = SystemMessagePromptTemplate.fromTemplate(chatSystemPrompt);

       const chatprompt = ChatPromptTemplate.fromMessages([
              message,
              chatPrompt
       ]);

       // Algorithm for finding emotions in the chatInfo object is bad, maybe try to find a better way to do this (rellay on the frontend to send the emotions in the right order)

       const formatedChatprompt = await chatprompt.invoke({
              age : chatInfo.age,
              gender : chatInfo.gender,
              question : chatInfo.message,
              happines : chatInfo.emotions.find(e => e.name === "happines")?.probability ?? 0,
              sadness : chatInfo.emotions.find(e => e.name === "sadness")?.probability ?? 0,
              anger : chatInfo.emotions.find(e => e.name === "anger")?.probability ?? 0,
              fear : chatInfo.emotions.find(e => e.name === "fear")?.probability ?? 0,
              surprise : chatInfo.emotions.find(e => e.name === "surprise")?.probability ?? 0,
              neutral : chatInfo.emotions.find(e => e.name === "neutral")?.probability ?? 0,
              disgust : chatInfo.emotions.find(e => e.name === "disgust")?.probability ?? 0,
       });

       formatedChatprompt.messages.forEach(m => console.log(m));

    //  const promptTemplate = PromptTemplate.fromTemplate(chatPrompt);

    //   const chain = promptTemplate.pipe(message);

    }
}