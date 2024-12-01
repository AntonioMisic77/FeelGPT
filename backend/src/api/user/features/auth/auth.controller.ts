import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { createEndpoint, getUserInfo } from "@/utils";
import { prisma } from "@/db";
import { UpdateUserInfoValidator } from "./user.validator";

// Register Endpoint
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const profileImage = req.file ? req.file.buffer.toString("base64") : undefined;

  try {
    const result = await registerUser(email, password, username, profileImage);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Login Endpoint
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const updateUserInfo = createEndpoint(
  UpdateUserInfoValidator,
  async (req, res) => {
    const { user } = getUserInfo(req);

    const { ...updateUserInfo } = req.body;
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...updateUserInfo,
      },
    });
    const { passwordHash: notUsed, ...restUser } = updatedUser;
    res.json({
      result: restUser,
    });
  }
);
