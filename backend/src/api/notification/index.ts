import express from "express";
import { scheduleTestNotification } from "./routine/scheduler";

const router = express.Router();

router.get("/test", async (req, res) => {
  const email = process.env.TEST_EMAIL;
  const username = process.env.TEST_USERNAME;

  if (!email || !username) {
    return res.status(500).json({
      success: false,
      message:
        "Test email or username is not configured in the environment variables.",
    });
  }

  try {
    await scheduleTestNotification({ email, username });
    res.json({
      success: true,
      message: `Test notification scheduled for ${username}.`,
    });
  } catch (error) {
    console.error("Error scheduling test notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to schedule test notification.",
    });
  }
});

export default router;
