import cors from "cors";
import { config as dotEnvConfig } from "dotenv";
import express from "express";
import morgan from "morgan";

import { api } from "@/api";
import { errorHandler, notFound404 } from "@/middlewares";
import { createEndpoint } from "@/utils";
import { PrismaClient } from "@prisma/client";

dotEnvConfig();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get(
  "/",
  createEndpoint({}, (req, res) => {
    res.json({
      result: "Hello FeelGPT!",
    });
  })
);

// Testing Prisma client
const prisma = new PrismaClient();
app.get(
  "/db-test",
  createEndpoint({}, async (req, res) => {
    try {
      const testUser = await prisma.user.create({
        data: {
          username: "testuser",
          email: `testuser-${Date.now()}@example.com`,
          passwordHash: "hashed_password",
        },
      });
    } catch (error) {
      console.error("Database operation failed:", error);
    }
  })
);

app.use("/api/v1", api);

app.use(notFound404);
app.use(errorHandler);

export default app;
