import React, { useState } from 'react';
import './ChatCard.scss';

const ChatCard = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Hello, how can I assist you today?', type: 'incoming' },
    { text: 'I have a question about your services.', type: 'outgoing' },
    { text: "Sure, I'm here to help. What would you like to know?", type: 'incoming' },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, type: 'outgoing' }]);
      setMessage('');
    }
  };

  return (
    <div className="chat-card">
      <div className="chat-header">
        <div className="h2">Chat</div>
      </div>
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatCard;
