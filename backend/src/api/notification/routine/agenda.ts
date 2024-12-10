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
  console.log("trying to read a template");
  const templatePath = path.join(__dirname, "emailTemplate.html");
  console.log("templatePath", templatePath);

   var source = "";
  if (!fs.existsSync(templatePath)) {
    console.error("Template file does not exist at:", templatePath);
  } else {
    source = fs.readFileSync(templatePath, "utf8");
    console.log("Template content:", source);
  }


  console.log("reading template", conversationTemplate);

  // Compile the template using Handlebars
  const template = handlebars.compile(conversationTemplate);

  console.log("template", template);

  const conversationSummary = await generateSessionSummary(email);

  console.log("conversationSummary", conversationSummary);

  const html = template({ username, conversationSummary });

  console.log("trying to send a mail");
  await sendMail(email, "Your Conversation Reminder", html);
  console.log("email sent");
});

const conversationTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Conversation Reminder</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        padding: 20px;
        background-color: #f4f4f4;
      }
      .content {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
      }
      .header {
        text-align: center;
        padding: 20px 0;
      }
      h1 {
        color: #333333;
      }
      .summary {
        background-color: #f9f9f9;
        padding: 15px;
        margin: 20px 0;
        border-radius: 5px;
      }
      .button {
        text-align: center;
        margin: 30px 0;
      }
      .button a {
        background-color: #007bff;
        color: #ffffff;
        padding: 15px 25px;
        text-decoration: none;
        border-radius: 5px;
      }
      .footer {
        text-align: center;
        color: #777777;
        font-size: 12px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">
        <!-- Header Section -->
        <div class="header">
          <h1>Hello, {{username}}!</h1>
          <p>How do you feel today?</p>
        </div>

        <!-- Summary Section -->
        <h2>Summary of our Last Session:</h2>
        <div class="summary">
          <p>{{conversationSummary}}</p>
        </div>

        <!-- Call-to-Action Button -->
        <div class="button">
          <a href="http://localhost:3001/chat">Start Your Conversation</a>
        </div>
      </div>
    </div>
  </body>
</html>
`;

export default agenda;
