import React from 'react';

interface LoginProps {
  onLogin: (asGuest: boolean) => void;
}

const ToothIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71,7.44a7.21,7.21,0,0,0-3.47-3.47A7.3,7.3,0,0,0,12,3,7.3,7.3,0,0,0,8.76,4,7.21,7.21,0,0,0,5.29,7.44,7.3,7.3,0,0,0,4,10.67,7.15,7.15,0,0,0,7.69,16l-2.5,4.33A1,1,0,0,0,6.06,22H17.94a1,1,0,0,0,.87-1.67L16.31,16a7.15,7.15,0,0,0,3.69-5.33A7.3,7.3,0,0,0,18.71,7.44ZM17.2,20H6.8L8.73,16.8a1,1,0,0,0,0-1,5.16,5.16,0,0,1-2.6-4.13,5.3,5.3,0,0,1,1-3.13,5.2,5.2,0,0,1,2.58-1.9,5.31,5.31,0,0,1,6.54,0,5.2,5.2,0,0,1,2.58,1.9A5.3,5.3,0,0,1,20,10.67a5.16,5.16,0,0,1-2.6,4.13,1,1,0,0,0,0,1Z"/>
    </svg>
);
  

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full text-center bg-slate-800 border border-slate-700 rounded-2xl shadow-sm p-6">
            <div className="flex justify-center mb-4">
                <ToothIcon />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">OralBio <span className="text-cyan-400">AI</span></h1>
            <p className="text-slate-400 mb-8">Your personalized oral health co-pilot.</p>

            <div className="space-y-4">
                <button
                    onClick={() => onLogin(false)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
                >
                    Sign In
                </button>
                <button
                    onClick={() => onLogin(true)}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                    Continue as Guest
                </button>
            </div>
        </div>
         <footer className="text-center p-4 text-slate-500 text-sm mt-8">
            <p>Disclaimer: This is an AI-powered tool and not a substitute for professional medical advice. Always consult with a qualified healthcare provider.</p>
        </footer>
    </div>
  );
};

export default Login;