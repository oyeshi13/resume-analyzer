import React from "react";
import ReactMarkdown from "react-markdown";





function ChatMessage({ message }) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`message-wrapper ${isAssistant ? "assistant" : "user"}`}>
      <div className="message-avatar">{isAssistant ? "AI" : "You"}</div>
      <div className="message-bubble">
        <div className="message-content">
          {message.role === "assistant" ? (
            <ReactMarkdown>
              {message.content}
            </ReactMarkdown>
          ) : (
            message.content
          )}
        </div>
        <div className="message-time">{message.timestamp}</div>
      </div>
    </div>
  );
}

export default ChatMessage;
