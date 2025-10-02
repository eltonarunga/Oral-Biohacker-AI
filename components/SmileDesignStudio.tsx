import React, { useState, useRef, useEffect } from 'react';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { generateSmileDesign } from '../services/apiService';
import { SmileDesignResult } from '../types';

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
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [loadingMessage, setLoadingMessage] = useState("AI is analyzing your smile...");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (isCameraOpen && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [isCameraOpen, stream]);

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

    const closeCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
        setStream(null);
    };

    const resetState = () => {
        setOriginalImage(null);
        setOriginalMimeType(null);
        setGeneratedResult(null);
        setError(null);
        setIsLoading(false);
        closeCamera();
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        resetState();

        const reader = new FileReader();
        reader.onload = (e) => {
            setOriginalImage(e.target?.result as string);
            setOriginalMimeType(file.type);
        };
        reader.onerror = () => {
            setError("Failed to read the image file.");
        };
        reader.readAsDataURL(file);
    };

    const handleTakePhotoClick = async () => {
        resetState();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                setStream(mediaStream);
                setIsCameraOpen(true);
            } catch (err) {
                console.error("Error accessing camera: ", err);
                setError("Could not access the camera. Please check permissions and try again.");
            }
        } else {
            setError("Your browser does not support camera access.");
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setOriginalImage(dataUrl);
                setOriginalMimeType('image/jpeg');
            } else {
                setError("Could not capture image from camera.");
            }
            closeCamera();
        }
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
    
    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <Card title="Smile Design Studio" icon={<SmileIcon />}>
                {/* Step 1: Initial Upload State */}
                {!originalImage && !isLoading && (
                     <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                        <span className="material-symbols-outlined text-5xl text-gray-400 mx-auto">add_a_photo</span>
                        <h3 className="mt-4 text-lg font-bold text-gray-800 dark:text-gray-200">Step 1: Provide Your Smile</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">For best results, use a clear, front-facing photo where your teeth are visible.</p>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                             <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                             <button onClick={triggerFileSelect} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">upload_file</span>
                                Select Image
                            </button>
                             <button onClick={handleTakePhotoClick} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">photo_camera</span>
                                Take Photo
                            </button>
                        </div>
                        {error && <p className="text-red-700 dark:text-red-300 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mt-4">{error}</p>}
                    </div>
                )}
                
                {/* Step 2: Confirm and Generate State */}
                {originalImage && !generatedResult && !isLoading && (
                    <div className="space-y-6 text-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Step 2: Ready to Redesign?</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This is the image our AI will work with.</p>
                        </div>
                        <img src={originalImage} alt="Your selected smile" className="rounded-lg shadow-md w-full object-contain max-h-80 mx-auto" />
                        {error && <p className="text-red-700 dark:text-red-300 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={handleDesignClick} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                ✨ Generate AI-Enhanced Smile
                            </button>
                            <button onClick={resetState} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-gray-200 font-bold py-3 px-4 rounded-lg transition duration-200">
                                Change Photo
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center p-8 flex flex-col items-center justify-center min-h-[300px]">
                        <Spinner />
                        <h3 className="mt-4 text-lg font-bold text-gray-800 dark:text-gray-200">Designing Your Smile...</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-opacity duration-500">{loadingMessage}</p>
                    </div>
                )}
                
                {/* Step 3: Results State */}
                {(generatedResult || (error && originalImage)) && !isLoading && (
                     <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Step 3: Your Results</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Compare your original smile with the AI-enhanced version.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-center mb-2 text-gray-600 dark:text-gray-400">Your Original Smile</h3>
                                <img src={originalImage!} alt="User's smile" className="rounded-lg shadow-md w-full object-contain max-h-80" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-center mb-2 text-blue-600 dark:text-blue-400">AI-Enhanced Smile</h3>
                                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg shadow-md w-full min-h-[200px] flex items-center justify-center aspect-square max-h-80 mx-auto">
                                    {generatedResult?.image ? (
                                        <img src={`data:image/png;base64,${generatedResult.image}`} alt="AI generated smile" className="rounded-lg w-full object-contain max-h-80" />
                                    ) : (
                                         <div className="text-center p-4">
                                            <span className="material-symbols-outlined text-5xl text-red-500">error</span>
                                            <p className="text-red-500 mt-2 font-semibold">Could not generate image</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{error}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                         <button onClick={resetState} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                            Start Over
                        </button>
                    </div>
                )}

            </Card>

            {isCameraOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4" role="dialog" aria-modal="true">
                    <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg rounded-lg mb-4 h-auto aspect-[4/3] object-cover bg-black"></video>
                    <div className="flex gap-4">
                        <button onClick={handleCapture} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-full transition duration-200 flex items-center gap-2">
                            <span className="material-symbols-outlined">radio_button_checked</span> Capture
                        </button>
                        <button onClick={closeCamera} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-full transition duration-200">
                            Cancel
                        </button>
                    </div>
                    <canvas ref={canvasRef} className="hidden" aria-hidden="true"></canvas>
                </div>
            )}
        </>
    );
};
export default SmileDesignStudio;
