import React, { useState, useRef, useCallback } from 'react';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { analyzeImage } from '../services/apiService';
import { ImageUploadPlaceholder } from './common/ImageUploadPlaceholder';

const ImageAnalyzer: React.FC = () => {
    const [image, setImage] = useState<{ data: string; mimeType: string; } | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetState = useCallback(() => {
        setImage(null);
        setPrompt('');
        setAnalysis(null);
        setError(null);
        setIsLoading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);

    const handleImageChange = (imageData: string, mimeType: string) => {
        setImage({ data: imageData, mimeType });
    };

    const handleAnalyze = async () => {
        if (!image || !prompt.trim()) {
            setError("Please upload an image and enter a prompt.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const base64Data = image.data.split(',')[1];
            const result = await analyzeImage(base64Data, image.mimeType, prompt);
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to analyze image.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card title="AI Image Analyzer" icon={<span className="material-symbols-outlined">image_search</span>}>
            <div className="space-y-6">
                {!image ? (
                    <ImageUploadPlaceholder onImageChange={handleImageChange} fileInputRef={fileInputRef} />
                ) : (
                    <div className="text-center">
                        <img src={image.data} alt="Selected for analysis" className="rounded-lg shadow-md w-full object-contain max-h-80 mx-auto" />
                        <button onClick={resetState} className="mt-4 text-sm font-medium text-primary hover:opacity-80">
                            Change Photo
                        </button>
                    </div>
                )}
                
                {image && (
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="analysis-prompt" className="text-sm font-medium text-subtle-light dark:text-subtle-dark block mb-1">Your Question</label>
                            <textarea
                                id="analysis-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., Do my gums look inflamed in this area?"
                                disabled={isLoading}
                                rows={3}
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-3 text-sm text-foreground-light dark:text-foreground-dark focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 placeholder-subtle-light dark:placeholder-subtle-dark"
                            />
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading || !prompt.trim()}
                            className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Spinner size="xs" variant="white" /> : <span className="material-symbols-outlined">psychology</span>}
                            <span>Analyze Image</span>
                        </button>
                    </div>
                )}

                {isLoading && (
                    <div className="py-8 flex justify-center">
                        <Spinner label="Analyzing..." />
                    </div>
                )}
                {error && (
                    <p className="text-red-700 dark:text-red-300 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>
                )}
                {analysis && (
                    <div className="pt-4 border-t border-border-light dark:border-border-dark">
                         <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-2">Analysis Result</h3>
                         <p className="text-sm text-subtle-light dark:text-subtle-dark whitespace-pre-wrap">{analysis}</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ImageAnalyzer;