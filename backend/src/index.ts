import "./paths";
import app from "./app";
import { ChatService } from "@/api/conversation/services/chat.service";

const port = process.env.PORT || 5000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening: http://localhost:${port}`);

  const chatService = new ChatService();

  chatService.chat().then((response) => {
    console.log(response);
  });

});
