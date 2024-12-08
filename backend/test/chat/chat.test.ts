import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { model } from 'mongoose';

config({ path: '.env.test' });

const prisma = new PrismaClient();

beforeAll(async () => {
    try {
        await prisma.$connect();
        console.log('Connected to Prisma test database.');
    } catch (error) {
        console.error('Prisma connection error:', error);
        throw error;
    }

});

afterAll(async () => {
    try {
        await prisma.$disconnect();
        console.log('Disconnected from Prisma test database.');
    } catch (error) {
        console.error('Error disconnecting Prisma:', error);
    }
});


describe('ChatServiceCallPHIModel', () => {
    it('should sucessfully call the azure phi model', async () => {
        const endpoint = process.env.AZURE_PHI_ENDPOINT ?? "";
        const apiKey = process.env.AZURE_PHI_API_KEY ?? "";

        const phiOIendpoint = endpoint + "/v1";

        const llm = new ChatOpenAI({
            model: "azureai",
            apiKey: apiKey,
            temperature: 0.8,
        },{ baseURL : phiOIendpoint });

        llm.invoke("Hello, how are you?").then((response) => {
            expect(response).toBeDefined();
        });
    });       
});


