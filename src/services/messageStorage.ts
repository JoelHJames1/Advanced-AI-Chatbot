import { Message } from '../types';

const STORAGE_KEY = 'chat_messages';

export const saveMessages = (messages: Message[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
};

export const loadMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const messages = JSON.parse(stored);
      // Convert stored date strings back to Date objects
      return messages.map((msg: Message) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
  return [];
};