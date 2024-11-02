import React, { useState } from 'react';
import { Send, Smile, Plus } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';
import { FileUpload } from './FileUpload';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleFileContent = (content: string) => {
    onSendMessage(content);
    setShowFileUpload(false);
  };

  return (
    <div className="border-t bg-white p-4">
      {showFileUpload && (
        <div className="mb-4">
          <FileUpload onFileContent={handleFileContent} />
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowFileUpload(!showFileUpload)}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Plus size={20} />
        </button>
        
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none"
          />
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Smile size={20} />
            </button>
            {showEmojiPicker && (
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </div>
        </div>
        
        <button
          type="submit"
          className={`p-2 rounded-full ${
            message.trim()
              ? 'text-indigo-600 hover:text-indigo-700'
              : 'text-gray-400'
          } transition-colors`}
          disabled={!message.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};