import { Request, Response } from "express";
import { registerUser, loginUser, verifyToken } from "./auth.service";
import { createEndpoint, getUserInfo } from "@/utils";
import { prisma } from "@/db";
import { ForgotPasswordValidator, LoginUserValidator, RegisterUserValidator, ResetPasswordValidator, UpdateUserInfoValidator, ChangePasswordValidator } from "./user.validator";
import { NotificationFrequency } from "@prisma/client";
import { cancelNotification, scheduleUserNotification } from "@/api/notification/routine/scheduler";
import crypto from "crypto";
import { config } from "dotenv";
import { sendMail } from "@/utils/sendEmail";
import bcrypt from "bcrypt";
// Register Endpoint
config();

export const register = createEndpoint(RegisterUserValidator, async (req: Request, res: Response) => {
  console.log(req);
  const { username, email, password, notificationFrequency, profileImage,
    notificationMode, notificationTime, responseTone, notificationDayOfWeek } = req.body;

  try {
    // include notificationDayOfWeek if the frequency is "weekly", else it is stored as undefined
    const dayOfWeek = notificationFrequency === 'weekly' ? notificationDayOfWeek : undefined;

    const result = await registerUser(email, password, username, profileImage, notificationFrequency,
      notificationMode, notificationTime, responseTone, dayOfWeek);

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
})


// **Updated Change Password Endpoint**
export const changePassword = createEndpoint(
  ChangePasswordValidator, // Use the updated validator with `body`
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const { user } = getUserInfo(req); // Extract user info consistently

    console.log("Im here..")

    try {
      // Fetch the user from the database using Prisma
      const foundUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!foundUser) {
        res.status(404).json({ status: "fail", message: "User not found." });
        return; // Exit the function after sending the response
      }

      // Compare oldPassword with the stored passwordHash
      const isMatch = await bcrypt.compare(
        oldPassword,
        foundUser.passwordHash
      );
      if (!isMatch) {
        res.status(401).json({
          status: "fail",
          message: "Old password is incorrect.",
        });
        return; // Exit the function after sending the response
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the passwordHash in the database
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashedPassword },
      });

      // Send success response without returning
      res.json({
        status: "ok",
        message: "Password updated successfully.",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      res.status(500).json({
        status: "fail",
        message: "Server error. Please try again later.",
      });
    }
  }
);

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
    // always get empty body when updating just profileImage
    console.log("updateUserInfoBE:", updateUserInfo);

    // Fetch the current user from the database to compare changes
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    console.log("currentUser:", currentUser);

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Validation: Adjust day and time based on notificationFrequency
    if (updateUserInfo.notificationFrequency === "NEVER") {
      updateUserInfo.notificationTime = undefined;
      updateUserInfo.notificationDayOfWeek = undefined;
    } else if (updateUserInfo.notificationFrequency === "DAILY") {
      updateUserInfo.notificationDayOfWeek = undefined;
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

    console.log("updated user info:");

    // Check if notification preferences or time have changed
    const hasNotificationPreferencesChanged =
      updatedUser.notificationFrequency !== currentUser.notificationFrequency;

    const hasNotificationTimeChanged =
      updatedUser.notificationTime?.getTime() !== currentUser.notificationTime?.getTime();

    const hasNotificationDayChanged =
      updatedUser.notificationDayOfWeek !== currentUser.notificationDayOfWeek;

    // Handle rescheduling logic only if relevant fields are updated
    if (
      hasNotificationPreferencesChanged ||
      hasNotificationTimeChanged ||
      hasNotificationDayChanged
    ) {
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

export const verify = createEndpoint({}, async (req, res) => {
  const authHeader = req.headers.authorization; // Bearer TOKEN
  const result = { message: 'Token is required' };

  if (!authHeader) {
    res.status(401).json({ result });
    return;
  }

  const token = authHeader.split(' ')[1]; // Extract token after "Bearer"

  if (!token) {
    res.status(401).json({ result: 'Malformed authorization header' });
    return;
  }

  try {
    const user = await verifyToken(token);
    res.status(200).json({ result: user });
    return;
  } catch (error: any) {
    res.status(401).json({ result: error.message });
    return;
  }
});


export const forgotPassword = createEndpoint(
  ForgotPasswordValidator,
  async (req, res) => {
    // const userId = req.query.id;
    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("User with this email does not exist.");
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const tokenExpiration = new Date(Date.now() + 3600 * 1000); // 1 hour validity

    // Update user with reset token and expiration
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiresAt: tokenExpiration,
      },
    });

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

    // Send email
    await sendMail(
      email,
      "Password Reset Request",
      `<p>You requested to reset your password.</p>
    <p>Click <a href="${resetLink}">here</a> to reset it.</p>
    <p>If you did not request this, please ignore this email.</p>`
    );

    res.status(200).json({ result: "success" });
  });

export const resetPassword = createEndpoint(
  ResetPasswordValidator,
  async (req, res) => {
    // const userId = req.query.id;
    const { email, token, newPassword } = req.body;

    // Hash the provided token
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with the email and valid token
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: tokenHash,
        resetTokenExpiresAt: { gte: new Date() },
      },
    });

    if (!user) {
      throw new Error("Invalid or expired token.");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user with the new password and clear the token
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    res.status(200).json({ result: "success" });
  });