import React, { useEffect, useRef, useCallback } from 'react';
import { predefinedAvatars } from '../data/predefinedAvatars';

interface AvatarSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAvatar: (url: string) => void;
  currentAvatarUrl?: string;
}

const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectAvatar,
  currentAvatarUrl,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Trap focus within modal and handle escape key
  useEffect(() => {
    if (!isOpen) return;

    // Focus the close button when modal opens
    closeButtonRef.current?.focus();

    // Add keyboard listener
    document.addEventListener('keydown', handleKeyDown);

    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleKeyDown]);

  const handleAvatarSelect = useCallback(
    (avatarUrl: string) => {
      onSelectAvatar(avatarUrl);
      onClose();
    },
    [onSelectAvatar, onClose]
  );

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h3
            id="avatar-modal-title"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Select an Avatar
          </h3>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white transition-colors rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            aria-label="Close avatar selection modal"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Avatar Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {predefinedAvatars.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-slate-400">
              No avatars available
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {predefinedAvatars.map((avatarUrl, index) => {
                const isSelected = avatarUrl === currentAvatarUrl;
                return (
                  <button
                    key={`avatar-${index}-${avatarUrl}`}
                    onClick={() => handleAvatarSelect(avatarUrl)}
                    className={`
                      relative rounded-full overflow-hidden aspect-square 
                      border-2 transition-all duration-200
                      hover:scale-105 hover:shadow-lg
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      dark:focus:ring-offset-slate-800
                      ${
                        isSelected
                          ? 'border-blue-600 dark:border-cyan-400 ring-2 ring-blue-600 dark:ring-cyan-400'
                          : 'border-transparent hover:border-gray-300 dark:hover:border-slate-600'
                      }
                    `}
                    aria-label={`Select avatar ${index + 1}${isSelected ? ' (currently selected)' : ''}`}
                    type="button"
                  >
                    <img
                      src={avatarUrl}
                      alt={`Avatar option ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-600/20 dark:bg-cyan-400/20 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-blue-600 dark:text-cyan-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelectionModal;