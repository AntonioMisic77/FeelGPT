import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Ensure database connection
  await prisma.$connect();

  console.log("Seeding the DB");

  // Create a dummy user
  const dummyUser = await prisma.user.upsert({
    where: { email: "mockuser@example.com" },
    update: {},
    create: {
      id: "mocked_user_id",
      username: "Mock User",
      email: "mockuser@example.com",
      passwordHash: "mockpassword",
      createdAt: new Date(),
    },
  });

  console.log("Dummy user created or already exists:", dummyUser);

  // Create a session for the dummy user
  const session = await prisma.session.upsert({
    where: { id: "mocked_session_id" },
    update: {},
    create: {
      id: "mocked_session_id",
      userId: dummyUser.id,
      sessionTitle: "Default Session",
      sessionSummary: null,
      interactionCount: 0,
      startTime: new Date(),
      status: "active",
    },
  });

  console.log("Dummy session created or already exists:", session);

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
