// test/app.test.ts
import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { mongo } from 'mongoose';

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

describe('GET /db-health', () => {
    it('should return a successful database connection message', async () => {
        const response = await request(app).get('/db-health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('result', 'Database connection is working');
    });
});