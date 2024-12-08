import express, { Application } from "express";
import multer from "multer";
import { register, login, updateUserInfo, getUser } from "./auth.controller";
import { isAuth } from "@/middlewares";

const upload = multer({ storage: multer.memoryStorage() }); // For file uploads

const authRouter = express.Router();

authRouter.post("/register", upload.single("profileImage"), register);
authRouter.post("/login", login);
authRouter.put("/update",isAuth, updateUserInfo);
authRouter.get("/me",isAuth, getUser);



export default authRouter;