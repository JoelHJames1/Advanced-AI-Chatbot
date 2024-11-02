import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Onboarding } from './components/Onboarding';
import { Message, UserSettings } from './types';
import { sendMessage } from './services/akashApi';
import { loadMessages } from './services/messageStorage';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contextMessages, setContextMessages] = useState<Message[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Load saved messages as context only
    const savedMessages = loadMessages();
    if (savedMessages.length > 0) {
      setContextMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Include both context and current messages for AI context
      const allContext = [...contextMessages, ...messages, userMessage];
      const response = await sendMessage(content, allContext);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response || 'Sorry, I encountered an error processing your request.',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      // Update context with the new messages
      setContextMessages((prev) => [...prev, userMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userSettings) {
    return <Onboarding onComplete={setUserSettings} />;
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col bg-white">
        <header className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://stackblitz.com/storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOVJzRXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--dee107d4ea54783f5a727bfcf23638099d0d7d25/JarvisRobot.png"
              alt="Jarvis"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h1 className="font-semibold">Jarvis</h1>
              <p className="text-xs opacity-75">AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={userSettings.avatar || 'https://via.placeholder.com/40'}
              alt={userSettings.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <span className="font-medium">{userSettings.name}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              userAvatar={userSettings.avatar}
            />
          ))}
          {isLoading && (
            <div className="flex gap-2 items-center text-gray-500">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default App;