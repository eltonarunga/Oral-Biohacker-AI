

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, LiveSession } from '@google/genai';
import { Card } from './common/Card';
import { encode } from '../utils/audio';

const VoiceNotes: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('Idle');

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const stopRecording = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
        setIsRecording(false);
        setStatus('Finished');
    }, []);
    
    const startRecording = async () => {
        if (isRecording) return;
        setTranscript('');
        setError(null);
        setStatus('Initializing...');
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        // FIX: Cast window to `any` to allow access to vendor-prefixed `webkitAudioContext` without a TypeScript error.
                        const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        audioContextRef.current = audioContext;
                        
                        const source = audioContext.createMediaStreamSource(stream);
                        sourceRef.current = source;

                        const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(audioContext.destination);
                        setStatus('Recording...');
                        setIsRecording(true);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            setTranscript(prev => prev + message.serverContent.inputTranscription.text);
                        }
                        if (message.serverContent?.turnComplete) {
                            setTranscript(prev => prev + ' ');
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setError('An error occurred during transcription.');
                        stopRecording();
                    },
                    onclose: () => {
                        // Clean up is handled in stopRecording
                    },
                },
                config: {
                    inputAudioTranscription: {},
                },
            });
            sessionPromiseRef.current = sessionPromise;

        } catch (err) {
            console.error('Failed to start recording:', err);
            setError('Could not access microphone. Please check permissions.');
            setStatus('Error');
        }
    };

    return (
        <Card title="Voice Notes" icon={<span className="material-symbols-outlined">record_voice_over</span>}>
            <div className="space-y-4">
                <div className="p-4 bg-background-light dark:bg-input-dark/50 rounded-lg min-h-[150px] border border-subtle-light/20 dark:border-subtle-dark/20">
                    <p className="text-foreground-light dark:text-foreground-dark whitespace-pre-wrap">
                        {transcript || <span className="text-subtle-light dark:text-subtle-dark">Your transcribed text will appear here...</span>}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-input-light dark:bg-input-dark rounded-lg">
                     <p className="text-sm font-medium text-subtle-light dark:text-subtle-dark">Status: {status}</p>
                     <div className="flex items-center gap-3">
                        <button 
                            onClick={startRecording} 
                            disabled={isRecording}
                            className="bg-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">mic</span> Start Recording
                        </button>
                        <button 
                            onClick={stopRecording} 
                            disabled={!isRecording}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">stop</span> Stop
                        </button>
                    </div>
                </div>
                 {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
            </div>
        </Card>
    );
};

export default VoiceNotes;