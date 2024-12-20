import { $Enums } from "@prisma/client";
import agenda from "./agenda";
import { prisma } from "@/db";

interface UserDTO {
  notificationTime: Date;
  notificationFrequency: $Enums.NotificationFrequency;
  email: string;
  username: string;
  id: string;
  passwordHash: string;
  createdAt: Date;
  lastLogin: Date | null;
  profileImage: string | null;
  notificationMode: $Enums.NotificationMode;
  notificationDayOfWeek: $Enums.DayOfWeek | null;
  responseTone: $Enums.ResponseTone;
}

const scheduleUserNotification = async (user: UserDTO) => {
  const notificationTime = new Date(user.notificationTime);

  if (user.notificationFrequency === "NEVER") {
    console.log(`No notifications scheduled for user: ${user.email}`);
    return; // Do nothing for users with "NEVER" frequency
  }

  let cronTime;
  if (user.notificationFrequency === "DAILY") {
    cronTime = `${notificationTime.getMinutes()} ${notificationTime.getHours()} * * *`;
  } else if (user.notificationFrequency === "WEEKLY" && user.notificationDayOfWeek) {
    const dayOfWeekMapping: { [key in $Enums.DayOfWeek]: number } = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    };

    const dayOfWeek = dayOfWeekMapping[user.notificationDayOfWeek];
    cronTime = `${notificationTime.getMinutes()} ${notificationTime.getHours()} * * ${dayOfWeek}`;
  } else {
    console.log(`Invalid weekly notification setup for user: ${user.email}`);
    return;
  }

  // Cancel existing job for the user
  await agenda.cancel({
    name: "send email reminder",
    "data.email": user.email,
  });

  // Schedule a new job
  await agenda.every(cronTime, "send email reminder", {
    email: user.email,
    username: user.username,
  });
};


const initializeUserJobs = async () => {
  const users = await prisma.user.findMany(); // Fetch all users
  for (const user of users) {
    if (user.notificationFrequency && user.notificationTime) {
      await scheduleUserNotification(user);
    }
  }
};

const cancelNotification = async (user: UserDTO) => {

  // Cancel existing job for the user
  await agenda.cancel({
    name: "send email reminder",
    "data.email": user.email,
  });
};

const scheduleTestNotification = async (user: {
  email: string;
  username: string;
}) => {
  const now = new Date();
  const testTime = new Date(now.getTime() + 10 * 1000); // Schedule for 10 seconds from now

  console.log(`Scheduling test email for ${user.username} at ${testTime}`);

  // Cancel any existing test jobs for this user
  await agenda.cancel({
    name: "send email reminder",
    "data.email": user.email,
  });

  // Schedule the test notification
  await agenda.schedule(testTime, "send email reminder", {
    email: user.email,
    username: user.username,
  });

  console.log(
    `Test email reminder scheduled for ${user.username} at ${testTime}`
  );
};

export {
  scheduleUserNotification,
  initializeUserJobs,
  scheduleTestNotification,
  cancelNotification
};
