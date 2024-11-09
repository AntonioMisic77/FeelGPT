import axios from "axios";
const API_URL = "http://localhost:5000/api/v1";

const chatService = {
  // Sends the latest chat message along with the detected emotion, age, gender to the backend.
  async sendMessageWithEmotion(chatData) {
    try {
      console.log("Sending chat data: ", chatData);

      // Send an HTTP POST request to the backend with the chat data
      const response = await axios.post(
        `${process.env.BACKEND_URL || API_URL}/conversation/chat/send`,
        chatData
      );

      // Return the response data from the backend
      return response.data;
    } catch (error) {
      console.error("Error sending message to backend: ", error.message);
      throw error;
    }
  },

  // method to get reply from backend
  async getReply() {
    try {
      const response = await axios.get(
        `${process.env.BACKEND_URL || API_URL}/reply`
      );
      return response.data.reply;
    } catch (error) {
      console.error("Error fetching reply from backend:", error.message);
      throw error;
    }
  },
};

export default chatService;
