
import React, { useState, useRef } from 'react';

interface ImageUploadPlaceholderProps {
    onImageChange: (imageData: string, mimeType: string) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export const ImageUploadPlaceholder: React.FC<ImageUploadPlaceholderProps> = ({ onImageChange, fileInputRef }) => {
    const [error, setError] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => onImageChange(e.target?.result as string, file.type);
        reader.onerror = () => setError("Failed to read the image file.");
        reader.readAsDataURL(file);
    };

    const handleTakePhotoClick = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                setStream(mediaStream);
                setIsCameraOpen(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                setError("Could not access camera. Please check permissions.");
            }
        } else {
            setError("Your browser does not support camera access.");
        }
    };
    
    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            onImageChange(canvas.toDataURL('image/jpeg'), 'image/jpeg');
            closeCamera();
        }
    };
    
    const closeCamera = () => {
        stream?.getTracks().forEach(track => track.stop());
        setIsCameraOpen(false);
        setStream(null);
    };

    return (
        <>
            <div className="text-center p-8 border-2 border-dashed border-subtle-light/40 dark:border-subtle-dark/40 rounded-lg">
                <span className="material-symbols-outlined text-5xl text-subtle-light dark:text-subtle-dark mx-auto">add_a_photo</span>
                <h3 className="mt-4 text-lg font-bold text-foreground-light dark:text-foreground-dark">Provide an Image</h3>
                <p className="mt-1 text-sm text-subtle-light dark:text-subtle-dark">Upload a file or use your camera.</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="bg-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">upload_file</span>
                        Select Image
                    </button>
                    <button onClick={handleTakePhotoClick} className="bg-input-dark hover:bg-subtle-dark text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">photo_camera</span>
                        Take Photo
                    </button>
                </div>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>

            {isCameraOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg rounded-lg mb-4 h-auto aspect-[4/3] object-cover bg-black"></video>
                    <div className="flex gap-4">
                        <button onClick={handleCapture} className="bg-primary hover:opacity-90 text-white font-bold py-3 px-6 rounded-full"><span className="material-symbols-outlined">radio_button_checked</span> Capture</button>
                        <button onClick={closeCamera} className="bg-input-dark/80 hover:bg-input-dark text-white font-bold py-3 px-6 rounded-full">Cancel</button>
                    </div>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
            )}
        </>
    );
};
