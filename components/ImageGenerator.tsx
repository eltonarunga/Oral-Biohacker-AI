import React, { useState, useCallback } from 'react';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { generateImage } from '../services/apiService';
import { NoDataIllustration } from './common/illustrations/NoDataIllustration';

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [aspectRatio, setAspectRatio] = useState<string>('1:1');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt to generate an image.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const resultBase64 = await generateImage(prompt, aspectRatio);
            setGeneratedImage(`data:image/jpeg;base64,${resultBase64}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate image.");
        } finally {
            setIsLoading(false);
        }
    }, [prompt, aspectRatio]);

    return (
        <Card title="AI Image Generator" icon={<span className="material-symbols-outlined">palette</span>}>
            <div className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="image-prompt" className="text-sm font-medium text-subtle-light dark:text-subtle-dark block mb-1">Prompt</label>
                        <textarea
                            id="image-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A futuristic dental clinic on Mars, cinematic lighting"
                            disabled={isLoading}
                            rows={3}
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-3 text-sm text-foreground-light dark:text-foreground-dark focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 placeholder-subtle-light dark:placeholder-subtle-dark"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-subtle-light dark:text-subtle-dark block mb-2">Aspect Ratio</label>
                        <div className="flex flex-wrap gap-2">
                            {aspectRatios.map(ratio => (
                                <button
                                    key={ratio}
                                    onClick={() => setAspectRatio(ratio)}
                                    disabled={isLoading}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors border-2 ${aspectRatio === ratio ? 'bg-primary border-primary text-white' : 'bg-black/5 dark:bg-white/5 border-transparent hover:border-primary/50'}`}
                                >
                                    {ratio}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Spinner size="xs" variant="white" /> : <span className="material-symbols-outlined">auto_awesome</span>}
                        <span>Generate Image</span>
                    </button>
                </div>

                {error && (
                    <p className="text-red-700 dark:text-red-300 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>
                )}

                <div className="min-h-[300px] flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-lg shadow-inner">
                    {isLoading ? (
                        <Spinner label="Generating your masterpiece..." />
                    ) : generatedImage ? (
                        <img src={generatedImage} alt="AI generated" className="rounded-lg shadow-md max-w-full max-h-[50vh] object-contain" />
                    ) : (
                        <div className="text-center p-4">
                           <NoDataIllustration className="w-32 h-32 mx-auto text-subtle-light dark:text-subtle-dark" />
                           <p className="text-subtle-light dark:text-subtle-dark mt-2">Your generated image will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default ImageGenerator;