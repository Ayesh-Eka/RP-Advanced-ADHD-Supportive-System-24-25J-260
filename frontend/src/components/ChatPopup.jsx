import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  // Toggle chat popup
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Send a default welcome message when the chat popup opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        role: 'assistant',
        content: 'Hello! I am your ADHD assistant. How can I help you today?',
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user's message to the chat
    const userMessage = { role: 'user', content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    try {
      // Send the message to the backend
      const response = await axios.post('http://localhost:5000/api/chat/chat', { message: inputMessage });
      const assistantMessage = { role: 'assistant', content: response.data.reply };

      // Add assistant's reply to the chat
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Failed to send message.' }]);
    }
  };

  return (
    <div>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-110"
      >
        💬
      </button>

      {/* Chat popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 max-w-full h-[70vh] max-h-[600px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg font-bold">Chat with AI</h2>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              ✕
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;