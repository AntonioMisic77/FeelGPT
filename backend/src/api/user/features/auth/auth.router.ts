import express, { Application } from "express";
import multer from "multer";
import { register, login } from "./auth.controller";

const upload = multer({ storage: multer.memoryStorage() }); // For file uploads


const authRouter = express.Router();

authRouter.post("/register", upload.single("profileImage"), register);
authRouter.post("/login", login);

export default authRouter;