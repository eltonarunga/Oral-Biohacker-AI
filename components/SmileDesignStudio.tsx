import React, { useState, useRef, useEffect } from 'react';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { generateSmileDesign } from '../services/apiService';
import { SmileDesignResult } from '../types';
import { ImageUploadPlaceholder } from './common/ImageUploadPlaceholder';

const SmileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SmileDesignStudio: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
    const [generatedResult, setGeneratedResult] = useState<SmileDesignResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState("AI is analyzing your smile...");

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isLoading) {
            const messages = [
                "Analyzing facial structure...",
                "Aligning teeth...",
                "Whitening and polishing...",
                "Crafting the perfect result..."
            ];
            let messageIndex = 0;
            const intervalId = setInterval(() => {
                messageIndex = (messageIndex + 1) % messages.length;
                setLoadingMessage(messages[messageIndex]);
            }, 2500); // Change message every 2.5 seconds

            return () => clearInterval(intervalId);
        }
    }, [isLoading]);

    const resetState = () => {
        setOriginalImage(null);
        setOriginalMimeType(null);
        setGeneratedResult(null);
        setError(null);
        setIsLoading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
        }
    };
    
    const handleImageChange = (imageData: string, mimeType: string) => {
        // Reset results when a new image is provided
        setGeneratedResult(null);
        setError(null);
        setIsLoading(false);
        setOriginalImage(imageData);
        setOriginalMimeType(mimeType);
    };

    const handleDesignClick = async () => {
        if (!originalImage || !originalMimeType) {
            setError("Please upload an image first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedResult(null);
        setLoadingMessage("AI is analyzing your smile...");

        try {
            // Data URL is "data:[mime];base64,[data]", we need to extract [data]
            const base64Data = originalImage.split(',')[1];
            const result = await generateSmileDesign(base64Data, originalMimeType);
            
            if (!result.image) {
              throw new Error("The AI did not return an image. It might have said: " + (result.text || "No reason given."));
            }
            setGeneratedResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <Card title="Smile Design Studio" icon={<SmileIcon />}>
            {/* Step 1: Initial Upload State */}
            {!originalImage && !isLoading && (
                 <div>
                    <ImageUploadPlaceholder onImageChange={handleImageChange} fileInputRef={fileInputRef} />
                    <p className="text-center text-xs text-subtle-light dark:text-subtle-dark mt-4">For best results, use a clear, front-facing photo where your teeth are visible.</p>
                    {error && <p className="text-red-700 dark:text-red-300 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mt-4">{error}</p>}
                </div>
            )}
            
            {/* Step 2: Confirm and Generate State */}
            {originalImage && !generatedResult && !isLoading && (
                <div className="space-y-6 text-center">
                    <div>
                        <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Step 2: Ready to Redesign?</h3>
                        <p className="mt-1 text-sm text-subtle-light dark:text-subtle-dark">This is the image our AI will work with.</p>
                    </div>
                    <img src={originalImage} alt="Your selected smile" className="rounded-lg shadow-md w-full object-contain max-h-80 mx-auto" />
                    {error && <p className="text-red-700 dark:text-red-300 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={handleDesignClick} className="flex-1 bg-primary hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            ✨ Generate AI-Enhanced Smile
                        </button>
                        <button onClick={resetState} className="flex-1 bg-subtle-light/20 hover:bg-subtle-light/30 text-foreground-light dark:bg-subtle-dark/20 dark:hover:bg-subtle-dark/30 dark:text-foreground-dark font-bold py-3 px-4 rounded-lg transition duration-200">
                            Change Photo
                        </button>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="text-center p-8 flex flex-col items-center justify-center min-h-[300px]">
                    <Spinner />
                    <h3 className="mt-4 text-lg font-bold text-foreground-light dark:text-foreground-dark">Designing Your Smile...</h3>
                    <p className="mt-1 text-sm text-subtle-light dark:text-subtle-dark transition-opacity duration-500">{loadingMessage}</p>
                </div>
            )}
            
            {/* Step 3: Results State */}
            {(generatedResult || (error && originalImage)) && !isLoading && (
                 <div className="space-y-6">
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Step 3: Your Results</h3>
                        <p className="mt-1 text-sm text-subtle-light dark:text-subtle-dark">Compare your original smile with the AI-enhanced version.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-center mb-2 text-subtle-light dark:text-subtle-dark">Your Original Smile</h3>
                            <img src={originalImage!} alt="User's smile" className="rounded-lg shadow-md w-full object-contain max-h-80" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-center mb-2 text-primary">AI-Enhanced Smile</h3>
                            <div className="bg-background-light dark:bg-input-dark/50 rounded-lg shadow-md w-full min-h-[200px] flex items-center justify-center aspect-square max-h-80 mx-auto">
                                {generatedResult?.image ? (
                                    <img src={`data:image/png;base64,${generatedResult.image}`} alt="AI generated smile" className="rounded-lg w-full object-contain max-h-80" />
                                ) : (
                                     <div className="text-center p-4">
                                        <span className="material-symbols-outlined text-5xl text-red-500">error</span>
                                        <p className="text-red-500 mt-2 font-semibold">Could not generate image</p>
                                        <p className="text-xs text-subtle-light dark:text-subtle-dark mt-1">{error}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                     <button onClick={resetState} className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                        Start Over
                    </button>
                </div>
            )}
        </Card>
    );
};
export default SmileDesignStudio;