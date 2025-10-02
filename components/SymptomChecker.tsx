
import React, { useState, useEffect, useRef } from 'react';
import { SymptomCheckerState, ChatMessage, GroundingChunk } from '../types';
import { createSymptomCheckerChat, sendMessageToSymptomChecker } from '../services/geminiService';

interface SymptomCheckerProps {
    state: SymptomCheckerState;
    setState: React.Dispatch<React.SetStateAction<SymptomCheckerState>>;
}

const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
    // Remove the suggestions block before rendering
    const cleanText = text.replace(/\[SUGGESTIONS\][\s\S]*/, '');

    // Safely parse bold markdown (**) into <strong> tags
    const parseLineContent = (line: string) => {
        const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part; // React will escape this string
        });
    };

    return (
        <div className="text-slate-800 dark:text-slate-200 text-sm">
            {cleanText.split('\n').map((line, index) => {
                // Check for markdown list items (* or -)
                const listItemMatch = line.match(/^\s*[\*\-]\s(.*)/);
                if (listItemMatch) {
                    return (
                        <div key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{parseLineContent(listItemMatch[1])}</span>
                        </div>
                    );
                }
                // Use a div with a min-height for empty lines to simulate <br> or pre-wrap behavior
                // This preserves paragraph spacing from the AI's response
                return <div key={index} className={line.trim() === '' ? 'min-h-[1em]' : ''}>{parseLineContent(line)}</div>;
            })}
        </div>
    );
};

const Sources: React.FC<{ sources: GroundingChunk[] }> = ({ sources }) => {
    if (!sources || sources.length === 0) return null;
    return (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Sources</h4>
            <ul className="space-y-1">
                {sources.map((source, index) => (
                    <li key={index}>
                        <a 
                            href={source.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                            <span>{source.web.title || source.web.uri}</span>
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const TypingIndicator: React.FC = () => (
    <div className="flex items-start gap-3 message-enter">
        <div className="flex-shrink-0 size-8 bg-cyan-500 text-white flex items-center justify-center rounded-full">
            <span className="material-symbols-outlined text-lg">spark</span>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-none p-3">
            <div className="flex items-center justify-center space-x-1">
                <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
        </div>
    </div>
);


const SymptomChecker: React.FC<SymptomCheckerProps> = ({ state, setState }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [state.history, state.isLoading]);

    useEffect(() => {
        const initChat = () => {
            if (state.chat) return; // Already initialized or in an error state from a previous attempt
            try {
                const newChat = createSymptomCheckerChat();
                const initialMessage: ChatMessage = { role: 'model', text: "Hello! I'm your OralBio AI assistant. How are you feeling today? Please describe any symptoms you're experiencing." };
                setState({ chat: newChat, history: [initialMessage], isLoading: false, suggestedReplies: ["I have a toothache", "My gums are bleeding", "I have bad breath"] });
            } catch (error) {
                const errorMessage: ChatMessage = { role: 'model', text: error instanceof Error ? error.message : 'Could not initialize the AI symptom checker.' };
                setState(prev => ({ ...prev, chat: null, history: [errorMessage], isLoading: false, suggestedReplies: [] }));
            }
        };
        
        // This check ensures we only try to init once if the history is empty
        if (state.history.length === 0) {
            initChat();
        }
    }, [state.chat, state.history.length, setState]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || !state.chat || state.isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: messageText };
        setState(prev => ({ ...prev, history: [...prev.history, userMessage], isLoading: true, suggestedReplies: [] }));
        setInput('');

        try {
            const response = await sendMessageToSymptomChecker(state.chat, messageText);
            const fullResponse = response.text;

            const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || [];

            const suggestionMatch = fullResponse.match(/\[SUGGESTIONS\]\s*(\[[\s\S]*\])/);
            let suggestions: string[] = [];
            if (suggestionMatch && suggestionMatch[1]) {
                try {
                    suggestions = JSON.parse(suggestionMatch[1]);
                } catch (e) {
                    console.error("Failed to parse suggested replies:", e);
                }
            }
            
            const modelMessage: ChatMessage = { role: 'model', text: fullResponse, sources: sources };
            
            setState(prev => ({ 
                ...prev, 
                history: [...prev.history, modelMessage], 
                suggestedReplies: suggestions 
            }));

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
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {state.history.map((msg, index) => (
                    msg.role === 'model' ? (
                        <div key={index} className="flex items-start gap-3 message-enter">
                            <div className="flex-shrink-0 size-8 bg-cyan-500 text-white flex items-center justify-center rounded-full">
                                <span className="material-symbols-outlined text-lg">spark</span>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-none p-3 max-w-[85%] md:max-w-2xl">
                                <FormattedMessage text={msg.text} />
                                <Sources sources={msg.sources || []} />
                            </div>
                        </div>
                    ) : (
                        <div key={index} className="flex items-start gap-3 justify-end message-enter">
                            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-3 max-w-[85%] md:max-w-2xl">
                                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                            <div className="flex-shrink-0 size-8 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 flex items-center justify-center rounded-full">
                                <span className="material-symbols-outlined text-lg">person</span>
                            </div>
                        </div>
                    )
                ))}
                
                {state.isLoading && state.history.length > 0 && state.history[state.history.length - 1].role === 'user' && <TypingIndicator />}

                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                {state.suggestedReplies.length > 0 && !state.isLoading && (
                     <div className="flex gap-2 flex-wrap justify-center mb-4">
                       {state.suggestedReplies.map((reply, index) => (
                         <button 
                            key={index}
                            onClick={() => handleSendMessage(reply)}
                            disabled={state.isLoading || !state.chat}
                            className="rounded-full border border-blue-500/50 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {reply}
                         </button>
                       ))}
                    </div>
                )}


                <form onSubmit={handleFormSubmit} className="relative">
                    <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-cyan-500 border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 h-14 placeholder:text-slate-500 dark:placeholder:text-slate-400 p-4 pr-12 text-base font-normal leading-normal"
                        placeholder={!state.chat ? "Symptom checker is unavailable." : "Type your message..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={state.isLoading || !state.chat}
                    />
                    <button type="submit" disabled={state.isLoading || !input.trim() || !state.chat} className="absolute right-2 top-1/2 -translate-y-1/2 flex size-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className="material-symbols-outlined text-2xl">arrow_upward</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SymptomChecker;