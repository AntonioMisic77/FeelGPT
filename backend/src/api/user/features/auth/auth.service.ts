import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {NotificationFrequency, NotificationMode, ResponseTone} from "@prisma/client";
import { prisma } from "@/db";
import { scheduleUserNotification } from "@/api/notification/routine/scheduler";

const SECRET_KEY = "your_secret_key"; // Replace with a strong secret key
const RESET_TOKEN_EXPIRY = "15m";

// Helper to generate JWT
const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "24h" });
};

export const getUserIdFromToken = (token: string): string => {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    return decoded.userId;
}

// Service to register a user
export const registerUser = async (
    email: string,
    password: string,
    username?: string,
    profileImage?: string,
    notificationFrequency?: NotificationFrequency , 
    notificationMode?: NotificationMode, 
    notificationTime?: Date, 
    responseTone?: ResponseTone
) => {
    // Check if the email is already in use

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("Email already in use.");
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    if (!username){
        username = email;
    }
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            passwordHash,
            profileImage,
            notificationFrequency,
            notificationMode,
            notificationTime,
            responseTone
        },
    });
    if (notificationTime && notificationFrequency){
        scheduleUserNotification(newUser);
      }

    // Generate JWT
    const token = generateToken(newUser.id);

    return { token, user: { id: newUser.id, username, email, profileImage } };
};

// Service to login a user
export const loginUser = async (email: string, password: string) => {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("Invalid email or password.");
    }

    // Compare the password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
        throw new Error("Invalid email or password.");
    }
    const updatedUser = await prisma.user.update({
        where: { email },
        data: { lastLogin: new Date() },
    });


    // Generate JWT
    const token = generateToken(user.id);

    return { token, user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        lastLogin: updatedUser.lastLogin,
      }, };
};
