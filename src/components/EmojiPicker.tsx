import React from 'react';
import data from '@emoji-mart/data/sets/14/apple.json';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void;
  onClose: () => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, onClose }) => {
  return (
    <div className="absolute bottom-full right-0 mb-2 z-50">
      <div className="relative">
        <div className="fixed inset-0" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-lg">
          <Picker
            data={data}
            onEmojiSelect={onEmojiSelect}
            theme="light"
            previewPosition="none"
            skinTonePosition="none"
            searchPosition="none"
            perLine={8}
            maxFrequentRows={1}
          />
        </div>
      </div>
    </div>
  );
};