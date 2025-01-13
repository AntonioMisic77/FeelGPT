import express, { Application } from "express";
import multer from "multer";
import { register, login, updateUserInfo, getUser, verify, forgotPassword, resetPassword, changePassword } from "./auth.controller";
import { isAuth } from "@/middlewares";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } //50mb
});

const authRouter = express.Router();

authRouter.post("/register", upload.single("profileImage"), register);
authRouter.post("/login", login);
authRouter.get("/verify", verify);
authRouter.put("/update", isAuth, upload.single("profileImage"), updateUserInfo);
authRouter.get("/me", isAuth, getUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/change-password", isAuth, changePassword);





export default authRouter;