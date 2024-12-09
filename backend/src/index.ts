import "./paths";
import app from "./app";
import { PrismaClient } from "@prisma/client";
import agenda from "./api/notification/routine/agenda";
import { initializeUserJobs } from "./api/notification/routine/scheduler";

const port = Number(process.env.PORT) || 5001;

const prisma = new PrismaClient();

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Prisma connected to the database.");

    // Start Agenda
    await agenda.start();
    console.log("Agenda scheduler started.");

    // Initialize jobs for all users
    await initializeUserJobs();
    console.log("Scheduled jobs for all users.");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Listening: http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down gracefully...");
  try {
    await agenda.stop();
    console.log("Agenda scheduler stopped.");

    await prisma.$disconnect();
    console.log("Prisma disconnected.");
  } catch (error) {
    console.error("Error during shutdown:", error);
  } finally {
    process.exit(0);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Start the server
startServer();
