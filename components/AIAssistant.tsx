import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, LiveSession } from '@google/genai';
import { Card } from './common/Card';
import { encode, decode, decodeAudioData } from '../utils/audio';

// ==================== TYPES ====================
type SessionStatus = 'Idle' | 'Connecting' | 'Connected' | 'Error' | 'Disconnected';

interface TranscriptEntry {
    id: number;
    speaker: 'user' | 'model';
    text: string;
}

// ==================== MAIN COMPONENT ====================
const AIAssistant: React.FC = () => {
    const [status, setStatus] = useState<SessionStatus>('Idle');
    const [error, setError] = useState<string | null>(null);
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const transcriptIdCounter = useRef(0);

    const cleanup = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close()).catch(console.error);
            sessionPromiseRef.current = null;
        }
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        sourceRef.current?.disconnect();
        sourceRef.current = null;
        if (audioContextRef.current?.state !== 'closed') {
            audioContextRef.current?.close().catch(console.error);
        }
        if (outputAudioContextRef.current?.state !== 'closed') {
            outputAudioContextRef.current?.close().catch(console.error);
        }
        sourcesRef.current.forEach(source => source.stop());
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;
    }, []);

    const stopSession = useCallback(() => {
        cleanup();
        setStatus('Disconnected');
    }, [cleanup]);

    const startSession = async () => {
        if (status === 'Connecting' || status === 'Connected') return;
        
        setStatus('Connecting');
        setError(null);
        setTranscript([]);
        transcriptIdCounter.current = 0;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('Connected');
                        setTranscript([{ id: transcriptIdCounter.current++, speaker: 'model', text: 'Connection established. I\'m ready to listen.' }]);
                        
                        const inputAudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        audioContextRef.current = inputAudioContext;
                        
                        outputAudioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

                        const source = inputAudioContext.createMediaStreamSource(stream);
                        sourceRef.current = source;
                        
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) { int16[i] = inputData[i] * 32768; }
                            const pcmBlob: Blob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
                            
                            sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob })).catch(err => {
                                console.error("Failed to send audio:", err);
                                setError("Connection lost. Please restart.");
                                stopSession();
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle Transcription
                        if (message.serverContent?.inputTranscription) {
                            const text = message.serverContent.inputTranscription.text;
                            setTranscript(prev => {
                                const last = prev[prev.length - 1];
                                if (last && last.speaker === 'user' && !message.serverContent?.turnComplete) {
                                    return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                                }
                                return [...prev, { id: transcriptIdCounter.current++, speaker: 'user', text }];
                            });
                        }
                        if (message.serverContent?.outputTranscription) {
                            const text = message.serverContent.outputTranscription.text;
                             setTranscript(prev => {
                                const last = prev[prev.length - 1];
                                if (last && last.speaker === 'model' && !message.serverContent?.turnComplete) {
                                    return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                                }
                                return [...prev, { id: transcriptIdCounter.current++, speaker: 'model', text }];
                            });
                        }

                        // Handle Audio Playback
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64Audio) {
                            const outputCtx = outputAudioContextRef.current!;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            source.addEventListener('ended', () => sourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setError('An error occurred. Please try again.');
                        cleanup();
                        setStatus('Error');
                    },
                    onclose: () => {
                        // No need to call stopSession here as it would be redundant.
                        // The user-initiated stopSession call handles cleanup.
                        setStatus('Disconnected');
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: 'You are a friendly and helpful oral health assistant.',
                },
            });
            sessionPromiseRef.current = sessionPromise;
        } catch (err) {
            console.error('Failed to start session:', err);
            setError('Could not access microphone. Please check permissions.');
            setStatus('Error');
        }
    };
    
    const isSessionActive = status === 'Connected' || status === 'Connecting';

    return (
        <Card title="AI Voice Assistant" icon={<span className="material-symbols-outlined">support_agent</span>}>
            <div className="space-y-4">
                <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg min-h-[300px] border border-black/10 dark:border-white/10 flex flex-col-reverse overflow-y-auto max-h-[50vh]">
                     <div className="space-y-4">
                        {transcript.map(entry => (
                            <div key={entry.id} className={`flex ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <p className={`max-w-[80%] p-3 rounded-xl text-sm ${entry.speaker === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-black/5 dark:bg-white/5 text-foreground-light dark:text-foreground-dark rounded-bl-none'}`}>
                                    {entry.text}
                                </p>
                            </div>
                        ))}
                        {transcript.length === 0 && (
                            <p className="text-subtle-light dark:text-subtle-dark text-center">Your conversation will appear here...</p>
                        )}
                     </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                     <p className="text-sm font-medium text-subtle-light dark:text-subtle-dark">Status: {status}</p>
                     <div className="flex items-center gap-3">
                        <button 
                            onClick={startSession} 
                            disabled={isSessionActive}
                            className="bg-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">play_arrow</span> Start Session
                        </button>
                        <button 
                            onClick={stopSession} 
                            disabled={!isSessionActive}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">stop</span> Stop Session
                        </button>
                    </div>
                </div>
                 {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
            </div>
        </Card>
    );
};

export default AIAssistant;