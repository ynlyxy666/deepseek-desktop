import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatWindow.css';

export default function ChatWindow({ visible, onSend }) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSend(inputText);
      setInputText('');
    }
  };

  return (
    <div className={`chat-container ${visible ? 'visible' : ''}`}>
      <div className="messages-wrapper">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <div className="bubble">
              {msg.content}
              {msg.thinking && <span className="typing-indicator"/>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="你想问些什么？按Enter发送"
          autoFocus
        />
      </form>
    </div>
  );
}