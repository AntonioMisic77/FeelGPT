import cors from "cors";
import { config as dotEnvConfig } from "dotenv";
import express from "express";
import morgan from "morgan";

import { api } from "@/api";
import { connectDB } from "@/db"
import { errorHandler, notFound404 } from "@/middlewares";
import { createEndpoint } from "@/utils";

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

app.use("/api/v1", api);

app.use(notFound404);
app.use(errorHandler);

export default app;
