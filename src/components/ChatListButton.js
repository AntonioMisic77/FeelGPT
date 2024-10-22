import "../styles/chatnavbar.css";
import ChatList from "./ChatList";

const ChatListButton = () => {
  return (
    <div className="chat-navbar-container">
      <p>
        <button
          class="btn btn-primary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseWidthExample"
          aria-expanded="false"
          aria-controls="collapseWidthExample"
        >
          X
        </button>
      </p>
      <ChatList/ >
    </div>
  );
};

export default ChatListButton;
