import React from 'react';
import { Card } from './common/Card';

interface LoginProps {
  onLogin: (asGuest: boolean) => void;
}

const ToothIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.34 4.23a2.42 2.42 0 0 1 2.33-2.23h.04a2.42 2.42 0 0 1 2.33 2.23l.1.75c.21 1.63.76 3.23 1.54 4.73.78 1.5.58 3.34-.52 4.54l-.1.1a5.07 5.07 0 0 1-7.14 0l-.1-.1a2.82 2.82 0 0 1-.52-4.54c.78-1.5 1.33-3.1 1.54-4.73l.1-.75Z" />
      <path d="M10.25 15.58c.84-.71 1.76-1.08 2.75-1.08s1.91.37 2.75 1.08" />
      <path d="M12 22v-3" />
      <path d="M7 22h10" />
    </svg>
);
  

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
        <Card className="max-w-md w-full text-center">
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
                    className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
                >
                    Continue as Guest
                </button>
            </div>
        </Card>
         <footer className="text-center p-4 text-slate-500 text-sm mt-8">
            <p>Disclaimer: This is an AI-powered tool and not a substitute for professional medical advice. Always consult with a qualified healthcare provider.</p>
        </footer>
    </div>
  );
};

export default Login;
