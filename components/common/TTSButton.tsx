

import React, { useState, useCallback } from 'react';
import { generateSpeech } from '../../services/ttsService';
import { decode, decodeAudioData } from '../../utils/audio';
import { Spinner } from './Spinner';

interface TTSButtonProps {
  textToSpeak: string;
  className?: string;
}

// Create a single AudioContext to be reused.
let audioContext: AudioContext | null = null;
const getAudioContext = () => {
  if (!audioContext || audioContext.state === 'closed') {
    // FIX: Cast window to `any` to allow access to vendor-prefixed `webkitAudioContext` without a TypeScript error.
    audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return audioContext;
};

export const TTSButton: React.FC<TTSButtonProps> = ({ textToSpeak, className }) => {
  const [playbackState, setPlaybackState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handlePlay = useCallback(async () => {
    if (playbackState !== 'idle' || !textToSpeak) return;

    setPlaybackState('loading');
    setError(null);

    try {
      const base64Audio = await generateSpeech(textToSpeak);
      const audioBytes = decode(base64Audio);
      
      const ctx = getAudioContext();
      await ctx.resume(); // Ensure context is running
      
      const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => {
        setPlaybackState('idle');
      };

      source.start();
      setPlaybackState('playing');

    } catch (err) {
      console.error("TTS failed:", err);
      setError(err instanceof Error ? err.message : "Audio generation failed.");
      setPlaybackState('idle');
    }
  }, [textToSpeak, playbackState]);

  const iconMap = {
    idle: 'volume_up',
    loading: 'loading',
    playing: 'stop_circle',
  };

  return (
    <button
      onClick={handlePlay}
      disabled={playbackState !== 'idle'}
      className={`flex items-center justify-center gap-2 text-sm font-medium p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      aria-label="Read text aloud"
      title={error || "Read aloud"}
    >
      {playbackState === 'loading' ? <Spinner size="xs" /> : <span className="material-symbols-outlined text-base">{iconMap[playbackState]}</span>}
    </button>
  );
};