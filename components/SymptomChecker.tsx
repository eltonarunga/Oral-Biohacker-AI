import React, { useState, useEffect, useRef } from 'react';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { SymptomCheckerState, ChatMessage } from '../types';
import { createSymptomCheckerChat, sendMessageToSymptomChecker } from '../services/geminiService';

interface SymptomCheckerProps {
    state: SymptomCheckerState;
    setState: React.Dispatch<React.SetStateAction<SymptomCheckerState>>;
}

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);

const SymptomChecker: React.FC<SymptomCheckerProps> = ({ state, setState }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [state.history]);

    useEffect(() => {
        const initChat = () => {
            const newChat = createSymptomCheckerChat();
            setState(prev => ({ ...prev, chat: newChat }));
        };
        if (!state.chat) {
            initChat();
        }
    }, [state.chat, setState]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !state.chat || state.isLoading) return;
        
        const userMessage: ChatMessage = { role: 'user', text: input };
        setState(prev => ({ ...prev, history: [...prev.history, userMessage], isLoading: true }));
        setInput('');

        try {
            const responseText = await sendMessageToSymptomChecker(state.chat, input);
            const modelMessage: ChatMessage = { role: 'model', text: responseText };
            setState(prev => ({ ...prev, history: [...prev.history, modelMessage] }));
        } catch (error) {
            console.error("Symptom checker failed:", error);
            const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
            setState(prev => ({ ...prev, history: [...prev.history, errorMessage] }));
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    };
    
    const handleClearHistory = () => {
        // Re-initialize the chat session to start fresh
        const newChat = createSymptomCheckerChat();
        setState({
            chat: newChat,
            history: [],
            isLoading: false,
        });
    };

    return (
        <Card title="AI Symptom Checker" icon={<ChatIcon />}>
            <div className="flex flex-col h-[65vh] lg:h-96">
                <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
                    {state.history.length === 0 && (
                        <div className="flex justify-start">
                            <div className="bg-slate-700 rounded-lg p-3 max-w-sm">
                                <p className="text-sm">Hello! Describe your oral health symptoms (e.g., 'my gums are bleeding when I brush' or 'I have a sharp pain in my back tooth').</p>
                            </div>
                        </div>
                    )}
                    {state.history.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-700'} rounded-lg p-3 max-w-sm`}>
                                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {state.isLoading && (
                        <div className="flex justify-start">
                             <div className="bg-slate-700 rounded-lg p-3 max-w-sm">
                                <Spinner />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your symptoms..."
                        className="flex-grow bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50"
                        disabled={state.isLoading}
                    />
                    <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold p-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={state.isLoading || !input.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                    <button 
                        type="button" 
                        onClick={handleClearHistory}
                        className="bg-slate-600 hover:bg-slate-700 text-slate-200 font-bold p-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={state.isLoading || state.history.length === 0}
                        aria-label="Clear chat history"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </form>
            </div>
        </Card>
    );
};

export default SymptomChecker;
