import "./paths";
import app from "./app";

import { connectDB } from "@/db";

const port = process.env.PORT || 5000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening: http://localhost:${port}`);
  connectDB();
});
