import React, { useState, useRef, useEffect } from 'react';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { designPerfectSmile } from '../services/geminiService';
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

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (isCameraOpen && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [isCameraOpen, stream]);

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

        try {
            // Data URL is "data:[mime];base64,[data]", we need to extract [data]
            const base64Data = originalImage.split(',')[1];
            const result = await designPerfectSmile(base64Data, originalMimeType);
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
                <div className="space-y-6">
                    {!originalImage && (
                        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-800">Show us your smile</h3>
                            <p className="mt-1 text-sm text-gray-500">Upload a photo or use your camera. For best results, use a clear, front-facing photo.</p>
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
                        </div>
                    )}
                    {originalImage && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-center mb-2 text-gray-600">Your Smile</h3>
                                 <img src={originalImage} alt="User's smile" className="rounded-lg shadow-md w-full object-contain max-h-80" />
                            </div>
                            <div>
                                 <h3 className="text-lg font-semibold text-center mb-2 text-blue-600">AI-Enhanced Smile</h3>
                                 <div className="bg-gray-100 rounded-lg shadow-md w-full min-h-[200px] flex items-center justify-center aspect-square max-h-80 mx-auto">
                                    {isLoading && <Spinner />}
                                    {!isLoading && generatedResult?.image && (
                                        <img src={`data:image/png;base64,${generatedResult.image}`} alt="AI generated smile" className="rounded-lg w-full object-contain max-h-80" />
                                    )}
                                    {!isLoading && !generatedResult && !error && (
                                        <p className="text-gray-500 text-center p-4">Your redesigned smile will appear here.</p>
                                    )}
                                    {!isLoading && error && (
                                        <p className="text-red-500 text-center p-4">Could not generate image.</p>
                                    )}
                                 </div>
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-700 text-center bg-red-100 p-3 rounded-lg">{error}</p>}
                    
                    {originalImage && (
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <button onClick={handleDesignClick} disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? 'Designing...' : '✨ Redesign My Smile'}
                            </button>
                             <button onClick={() => resetState()} disabled={isLoading} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50">
                                Start Over
                            </button>
                        </div>
                    )}
                </div>
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