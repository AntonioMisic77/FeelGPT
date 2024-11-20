// test/app.test.ts
import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load environment variables from .env.test
config({ path: '.env.test' });

const prisma = new PrismaClient();

beforeAll(async () => {
    // Connect to the Prisma test database
    try {
        await prisma.$connect();
        console.log('Connected to Prisma test database.');
    } catch (error) {
        console.error('Prisma connection error:', error);
        throw error;
    }

    // Connect to MongoDB test database
    const MONGO_URI = process.env.MONGO_URI_TEST;
    if (!MONGO_URI) {
        throw new Error('MONGO_URI_TEST is not defined in environment variables.');
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB test database.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
});

afterAll(async () => {
    // Disconnect from Prisma
    try {
        await prisma.$disconnect();
        console.log('Disconnected from Prisma test database.');
    } catch (error) {
        console.error('Error disconnecting Prisma:', error);
    }

    // Disconnect from MongoDB
    try {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB test database.');
    } catch (error) {
        console.error('Error disconnecting MongoDB:', error);
    }
});

describe('GET /db-health', () => {
    it('should return a successful database connection message', async () => {
        const response = await request(app).get('/db-health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('result', 'Database connection is working');
    });
});
