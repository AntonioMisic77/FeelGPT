import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { createEndpoint, getUserInfo } from "@/utils";
import { prisma } from "@/db";
import { LoginUserValidator, RegisterUserValidator, UpdateUserInfoValidator } from "./user.validator";
import { NotificationFrequency } from "@prisma/client";
import { cancelNotification, scheduleUserNotification } from "@/api/notification/routine/scheduler";

// Register Endpoint

export const register = createEndpoint(RegisterUserValidator, async (req: Request, res: Response) => {
  const { username, email, password, notificationFrequency, profileImage,
    notificationMode, notificationTime, responseTone } = req.body;

  try {
    const result = await registerUser(email, password, username, profileImage, notificationFrequency,
      notificationMode, notificationTime, responseTone);
      
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
})


// Login Endpoint
export const login = createEndpoint(LoginUserValidator, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
})

export const updateUserInfo = createEndpoint(
  UpdateUserInfoValidator,
  async (req, res) => {
    const { user } = getUserInfo(req);

    const { ...updateUserInfo } = req.body;

    // Fetch the current user from the database to compare changes
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!currentUser) {
      throw new Error ("User not found");
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...updateUserInfo,
      },
    });

    // Check if notification preferences or time have changed
    const hasNotificationPreferencesChanged =
      updatedUser.notificationFrequency !== currentUser.notificationFrequency;

    const hasNotificationTimeChanged =
      updatedUser.notificationTime.getTime() !== currentUser.notificationTime.getTime();

    // Handle rescheduling logic only if relevant fields are updated
    if (hasNotificationPreferencesChanged || hasNotificationTimeChanged) {
      if (
        updatedUser.notificationFrequency === "NEVER" ||
        !updatedUser.notificationTime
      ) {
        // Cancel notifications if the frequency is "NEVER" or no time is set
        await cancelNotification(updatedUser);
      } else {
        // Reschedule notifications with the updated preferences
        await scheduleUserNotification(updatedUser);
      }
    }

    // Remove sensitive fields like passwordHash from the response
    const { passwordHash, ...restUser } = updatedUser;

    res.json({
      result: restUser,
    });
  }
);


export const getUser = createEndpoint({}, async (req, res) => {
  // const userId = req.query.id;
  const { user } = getUserInfo(req);
  const fetchedUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });
  if (!fetchedUser) throw new Error("User Not Found");
  const { passwordHash: notUsed, ...rest } = fetchedUser;
  res.json({
    result: rest,
  });
});
