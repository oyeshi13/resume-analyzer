import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";

function ChatInterface({ messages, onSendMessage, isAnalyzing}) {
  const [stepIndex, setStepIndex] = useState(0);
  

  const loadingSteps = [
    "📄 Reading documents...",
    "🔍 Extracting skills...",
    "📊 Calculating ATS score...",
    "🎯 Matching job requirements...",
    "🤖 Generating recommendations...",
  ];

  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  return (
    <div className="chat-interface">
      <div className="messages-window">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isAnalyzing && (
          <ChatMessage
            message={{
              id: "loading",
              role: "assistant",
              content: loadingSteps[stepIndex],
              timestamp: "",
            }}
          />
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about the resume (e.g., 'What are the core technical gaps?')"
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;
