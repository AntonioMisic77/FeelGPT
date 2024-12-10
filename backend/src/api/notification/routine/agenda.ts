import { Agenda, Job } from "agenda";
import { sendMail } from "@/utils/sendEmail";

import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { generateSessionSummary } from "@/api/conversation/features/chat/chat.service";

const agenda = new Agenda({
  db: {
    address:
      process.env.MONGO_URI ||
      "mongodb://root:rootpassword@mongodb:27017/feelgpt_dev",
  },
});

agenda.define("send email reminder", async (job: Job) => {
  const data = job.attrs.data as { email: string; username: string };
  const { email, username } = data;

  console.log(`Sending email to ${email}`);

  // Read the HTML template
  const templatePath = path.join(__dirname, "emailTemplate.html");
  const source = fs.readFileSync(templatePath, "utf8");

  console.log("reading template", source);

  // Compile the template using Handlebars
  const template = handlebars.compile(source);

  console.log("template", template);

  const conversationSummary = await generateSessionSummary(email);

  console.log("conversationSummary", conversationSummary);

  const html = template({ username, conversationSummary });

  console.log("trying to send a mail");
  await sendMail(email, "Your Conversation Reminder", html);
  console.log("email sent");
});

export default agenda;
