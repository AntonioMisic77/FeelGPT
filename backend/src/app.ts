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
      result: "Hello FeelGPT!!",
    });
  })
);

// Testing Prisma client
const prisma = new PrismaClient();
app.get(
  "/db-health",
  createEndpoint({}, async (req, res) => {
    try {
      await prisma.$connect();

      res.json({
        result: "Database connection is working",
      });
    } catch (error) {
      console.error("Database connection failed:", error);

      res.status(500).json({
        result: "Database connection failed",
      });
    } finally {
      await prisma.$disconnect();
    }
  })
);

app.use("/api/v1", api);

app.use(notFound404);
app.use(errorHandler);

export default app;
