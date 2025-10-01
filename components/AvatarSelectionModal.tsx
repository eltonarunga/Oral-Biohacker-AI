import React from 'react';
import { predefinedAvatars } from '../data/predefinedAvatars';

interface AvatarSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAvatar: (url: string) => void;
}

const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({ isOpen, onClose, onSelectAvatar }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="avatar-modal-title">
      <div className="bg-slate-800 rounded-xl shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 id="avatar-modal-title" className="text-xl font-bold text-white">Select an Avatar</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {predefinedAvatars.map((avatarUrl, index) => (
              <button key={index} onClick={() => onSelectAvatar(avatarUrl)} className="rounded-full overflow-hidden aspect-square border-2 border-transparent hover:border-cyan-400 focus:border-cyan-400 focus:outline-none transition-all" aria-label={`Select avatar ${index + 1}`}>
                <img src={avatarUrl} alt={`Avatar option ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelectionModal;