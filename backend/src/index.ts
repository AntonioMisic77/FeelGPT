import "./paths";
import app from "./app";

const port = Number(process.env.PORT) || 5000;

app.listen(port, "0.0.0.0",() => {
  // eslint-disable-next-line no-console
  console.log(`Listening: http://0.0.0.0:${port}`);
});
