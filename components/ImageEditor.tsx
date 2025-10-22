import React, { useState, useRef, useCallback } from 'react';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { editImage } from '../services/apiService';
import { ImageUploadPlaceholder } from './common/ImageUploadPlaceholder';

const ImageEditor: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<{ data: string; mimeType: string; } | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (imageData: string, mimeType: string) => {
        setOriginalImage({ data: imageData, mimeType });
        setEditedImage(null);
        setError(null);
    };

    const handleEdit = async () => {
        if (!originalImage || !prompt.trim()) {
            setError("Please upload an image and enter a prompt.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const base64Data = originalImage.data.split(',')[1];
            const resultBase64 = await editImage(base64Data, originalImage.mimeType, prompt);
            setEditedImage(`data:image/png;base64,${resultBase64}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to edit image.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card title="AI Image Editor" icon={<span className="material-symbols-outlined">auto_fix</span>}>
            <div className="space-y-6">
                 {!originalImage && <ImageUploadPlaceholder onImageChange={handleImageChange} fileInputRef={fileInputRef} />}
                
                {originalImage && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-center mb-2 text-subtle-light dark:text-subtle-dark">Original</h3>
                                <img src={originalImage.data} alt="Original" className="rounded-lg shadow-md w-full object-contain max-h-80" />
                            </div>
                            <div className="flex items-center justify-center min-h-[200px] bg-black/5 dark:bg-white/5 rounded-lg shadow-inner aspect-square max-h-80 mx-auto w-full">
                               {isLoading ? (
                                    <Spinner label="Editing..." />
                                ) : editedImage ? (
                                    <div>
                                        <h3 className="text-lg font-semibold text-center mb-2 text-primary">Edited</h3>
                                        <img src={editedImage} alt="Edited" className="rounded-lg w-full object-contain max-h-80" />
                                    </div>
                                ) : (
                                    <div className="text-center p-4">
                                        <span className="material-symbols-outlined text-5xl text-subtle-light dark:text-subtle-dark">photo_filter</span>
                                        <p className="text-subtle-light dark:text-subtle-dark mt-2">Your edited image will appear here</p>
                                     </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="edit-prompt" className="text-sm font-medium text-subtle-light dark:text-subtle-dark block mb-1">Editing Prompt</label>
                            <textarea
                                id="edit-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., Add a retro filter, or remove the person in the background"
                                disabled={isLoading}
                                rows={2}
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-3 text-sm text-foreground-light dark:text-foreground-dark focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 placeholder-subtle-light dark:placeholder-subtle-dark"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                             <button
                                onClick={handleEdit}
                                disabled={isLoading || !prompt.trim()}
                                className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Spinner size="xs" variant="white" /> : <span className="material-symbols-outlined">magic_button</span>}
                                <span>Apply Edit</span>
                            </button>
                             <button onClick={() => setOriginalImage(null)} className="w-full sm:w-auto bg-black/5 hover:bg-black/10 text-foreground-light dark:bg-white/5 dark:hover:bg-white/10 dark:text-foreground-dark font-bold py-3 px-6 rounded-lg transition duration-200">
                                Start Over
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="text-red-700 dark:text-red-300 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mt-4">{error}</p>
                )}
            </div>
        </Card>
    );
};

export default ImageEditor;