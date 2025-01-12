import axiosInstance from "../api/axiosInstance";

const chatService = {
  // Sends the latest chat message along with the detected emotion, age, gender to the backend.
  async sendMessageWithEmotion(chatData) {
    try {
      console.log("Sending chat data: ", chatData);

      // Send an HTTP POST request to the backend with the chat data
      const response = await axiosInstance.post(
        "/conversation/chat/send",
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
      const response = await axiosInstance.get("/reply");
      return response.data.reply;
    } catch (error) {
      console.error("Error fetching reply from backend:", error.message);
      throw error;
    }
  },
  // method to get all sessions
  async getAllSessions() {
    try {
      const response = await axiosInstance.get("/conversation/chat/sessions");
      return response.data.result;
    } catch (error) {
      console.error("Error fetching sessions:", error.message);
      throw error;
    }
  },

  async getSessionMessages(sessionId) {
    try {
      const response = await axiosInstance.get(
        `/conversation/chat/sessions/${sessionId}/messages`
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching session messages:", error);
      throw error;
    }
  },

  // method to delete a specific session
  async deleteSession(sessionId) {
    try {
      const response = await axiosInstance.delete(
        `/conversation/chat/sessions/${sessionId}`
      );
      return response.data.result;
    } catch (error) {
      console.error("Error deleting session:", error.message);
      throw error;
    }
  },

  async deleteAllSessions() {
    try {
      const response = await axiosInstance.delete(
        "/conversation/chat/sessions"
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting all sessions:", error.message);
      throw error;
    }
  },
};

export default chatService;
