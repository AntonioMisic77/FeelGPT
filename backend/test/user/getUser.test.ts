// tests/user/getUser.test.ts
import { PrismaClient, User } from '@prisma/client';
import { config } from 'dotenv';
import { ObjectId } from 'mongodb';

config({ path: '.env.test' }); // Load environment variables for testing

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

describe('User Retrieval Tests', () => {
    let existingUser: User;

    beforeAll(async () => {
        // Ensure there's at least one user in the database.
        // You can create a user here or ensure your test database is seeded appropriately.
        // For this example, we'll create a new user.

        existingUser = await prisma.user.upsert({
            where: { email: 'testuser@example.com' },
            update: {},
            create: {
                id: new ObjectId().toHexString(),
                username: 'testuser',
                email: 'testuser@example.com',
                passwordHash: 'hashedpassword123',
                // You can set other required fields as needed
                notificationFrequency: 'DAILY',
                notificationMode: 'EMAIL',
                notificationTime: new Date(),
                responseTone: 'NEUTRAL',
            },
        });
    });

    afterAll(async () => {
        // Clean up the test user to maintain test isolation
        await prisma.user.deleteMany({
            where: {
                email: 'testuser@example.com',
            },
        });
    });

    it('should successfully retrieve an existing user from the database', async () => {
        // Fetch the user by email
        const user: User | null = await prisma.user.findUnique({
            where: { email: 'testuser@example.com' },
        });

        // Assertions to ensure the user is retrieved correctly
        expect(user).toBeDefined();
        expect(user).not.toBeNull(); // Additional assertion to help TypeScript

        // Use non-null assertion operator to inform TypeScript that 'user' is not null
        expect(user!.id).toBeDefined();
        expect(user).toHaveProperty('username', 'testuser');
        expect(user).toHaveProperty('email', 'testuser@example.com');
        expect(user).toHaveProperty('passwordHash');
        expect(typeof user!.id).toBe('string'); // MongoDB ObjectId as string
        expect(typeof user!.email).toBe('string');
    });

    it('should successfully retrieve a user by ID', async () => {
        // Fetch the user by ID
        const fetchedUser: User | null = await prisma.user.findUnique({
            where: { id: existingUser.id },
        });

        // Assertions to ensure the correct user is retrieved
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser).not.toBeNull(); // Additional assertion to help TypeScript

        expect(fetchedUser!.id).toBe(existingUser.id);
        expect(fetchedUser!.email).toBe(existingUser.email);
    });

    it('should return null when retrieving a user with a non-existent ID', async () => {
        // Generate a random ObjectId that does not exist in the database
        const randomId = new ObjectId().toHexString();

        // Attempt to fetch the user by the random ID
        const user: User | null = await prisma.user.findUnique({
            where: { id: randomId },
        });

        // Assertions to ensure no user is found
        expect(user).toBeNull();
    });
});
