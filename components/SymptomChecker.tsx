import React, { useState, useEffect, useRef } from 'react';
import { Spinner } from './common/Spinner';
import { SymptomCheckerState, ChatMessage, Page } from '../types';
import { createSymptomCheckerChat, sendMessageToSymptomChecker } from '../services/geminiService';

interface SymptomCheckerProps {
    state: SymptomCheckerState;
    setState: React.Dispatch<React.SetStateAction<SymptomCheckerState>>;
    onNavigate: (page: Page) => void;
}

const suggestedReplies = [
    "A few days",
    "It's about the same",
    "Yes, it's worse",
];

const SymptomChecker: React.FC<SymptomCheckerProps> = ({ state, setState, onNavigate }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [state.history]);

    useEffect(() => {
        const initChat = () => {
            const newChat = createSymptomCheckerChat();
            const initialMessage: ChatMessage = { role: 'model', text: "Hello! I'm your personal health assistant. How are you feeling today? Please describe your symptoms." };
            setState({ chat: newChat, history: [initialMessage], isLoading: false });
        };
        if (!state.chat) {
            initChat();
        }
    }, [state.chat, setState]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || !state.chat || state.isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: messageText };
        setState(prev => ({ ...prev, history: [...prev.history, userMessage], isLoading: true }));
        setInput('');

        try {
            const responseText = await sendMessageToSymptomChecker(state.chat, messageText);
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

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
    };
    
    return (
        <div className="relative flex size-full min-h-screen flex-col bg-white justify-between overflow-x-hidden">
            <div className="flex flex-col flex-1">
                <header className="flex items-center p-4 justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-slate-100">
                    <button onClick={() => onNavigate('dashboard')} className="text-slate-900 flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <h1 className="text-slate-900 text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Symptom Checker</h1>
                </header>

                <main className="px-4 flex flex-col gap-6 flex-1 py-6">
                    <div className="flex-1 flex flex-col gap-4">
                        {state.history.map((msg, index) => (
                            msg.role === 'model' ? (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 size-8 bg-cyan-500 text-white flex items-center justify-center rounded-full">
                                        <span className="material-symbols-outlined text-lg">spark</span>
                                    </div>
                                    <div className="bg-slate-100 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                                        <p className="text-slate-800 text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                    </div>
                                </div>
                            ) : (
                                <div key={index} className="flex items-start gap-3 justify-end">
                                    <div className="bg-cyan-500 text-white rounded-2xl rounded-tr-none p-3 max-w-[80%]">
                                        <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                    </div>
                                </div>
                            )
                        ))}
                         {state.isLoading && (
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 size-8 bg-cyan-500 text-white flex items-center justify-center rounded-full">
                                    <span className="material-symbols-outlined text-lg">spark</span>
                                </div>
                                <div className="bg-slate-100 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                                    <Spinner />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="flex gap-3 flex-wrap">
                       {suggestedReplies.map((reply, index) => (
                         <button 
                            key={index}
                            onClick={() => handleSendMessage(reply)}
                            disabled={state.isLoading}
                            className="flex items-center justify-center gap-x-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium leading-normal text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {reply}
                         </button>
                       ))}
                    </div>
                </main>
            </div>
            <footer className="sticky bottom-0 bg-white/80 backdrop-blur-sm z-10 px-4 pb-4 pt-2">
                <form onSubmit={handleFormSubmit} className="relative">
                    <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-slate-900 focus:outline-0 focus:ring-2 focus:ring-cyan-500 border-slate-200 bg-slate-100 h-14 placeholder:text-slate-500 p-4 pr-12 text-base font-normal leading-normal"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={state.isLoading}
                    />
                    <button type="submit" disabled={state.isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 flex size-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className="material-symbols-outlined text-2xl">arrow_upward</span>
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default SymptomChecker;