import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { GenerateContentResponse } from "@google/genai";
import { getChat } from '../services/chatService';
import { Spinner } from './common/Spinner';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
    id: number;
    sender: 'user' | 'model';
    text: string;
    isStreaming?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 0, sender: 'model', text: 'Hello! How can I help you with your oral health today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userInput: ChatMessage = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userInput]);
        setInput('');
        setIsLoading(true);

        const modelResponseId = Date.now() + 1;
        
        try {
            const chat = getChat();
            const result = await chat.sendMessageStream({ message: input });

            let fullText = '';
            setMessages(prev => [...prev, { id: modelResponseId, sender: 'model', text: '', isStreaming: true }]);

            for await (const chunk of result) {
                fullText += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === modelResponseId ? { ...msg, text: fullText } : msg
                ));
            }

             setMessages(prev => prev.map(msg => 
                msg.id === modelResponseId ? { ...msg, isStreaming: false } : msg
            ));

        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMsg: ChatMessage = {
                id: modelResponseId,
                sender: 'model',
                text: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages(prev => prev.some(m => m.id === modelResponseId) ? prev.map(m => m.id === modelResponseId ? errorMsg : m) : [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-20 right-4 z-40 w-[calc(100%-2rem)] max-w-sm h-[60vh] max-h-[500px] glass-card shadow-2xl rounded-xl flex flex-col animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <header className="flex items-center justify-between p-3 border-b border-border-light dark:border-border-dark">
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">smart_toy</span>
                    <h2 className="font-bold text-foreground-light dark:text-foreground-dark">AI Assistant</h2>
                </div>
                <button onClick={onClose} className="p-2 text-subtle-light dark:text-subtle-dark hover:text-foreground-light dark:hover:text-foreground-dark rounded-full">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </header>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                     {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <p className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-black/5 dark:bg-white/5 text-foreground-light dark:text-foreground-dark rounded-bl-none'}`}>
                                {msg.text}
                                {msg.isStreaming && <span className="inline-block w-2 h-2 ml-1 bg-current rounded-full animate-pulse"></span>}
                            </p>
                        </div>
                    ))}
                    {isLoading && messages[messages.length-1]?.sender === 'user' && (
                        <div className="flex justify-start">
                            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl rounded-bl-none">
                               <Spinner size="xs" />
                            </div>
                        </div>
                    )}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a quick question..."
                        disabled={isLoading}
                        className="flex-1 w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-3 text-sm text-foreground-light dark:text-foreground-dark focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 placeholder-subtle-light dark:placeholder-subtle-dark"
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="bg-primary text-white rounded-lg p-3 disabled:opacity-50">
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chatbot;