import React, { useState } from 'react';

interface LoginProps {
  onLogin: (method: 'google' | 'guest') => void;
}

const ToothIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71,7.44a7.21,7.21,0,0,0-3.47-3.47A7.3,7.3,0,0,0,12,3,7.3,7.3,0,0,0,8.76,4,7.21,7.21,0,0,0,5.29,7.44,7.3,7.3,0,0,0,4,10.67,7.15,7.15,0,0,0,7.69,16l-2.5,4.33A1,1,0,0,0,6.06,22H17.94a1,1,0,0,0,.87-1.67L16.31,16a7.15,7.15,0,0,0,3.69-5.33A7.3,7.3,0,0,0,18.71,7.44ZM17.2,20H6.8L8.73,16.8a1,1,0,0,0,0-1,5.16,5.16,0,0,1-2.6-4.13,5.3,5.3,0,0,1,1-3.13,5.2,5.2,0,0,1,2.58-1.9,5.31,5.31,0,0,1,6.54,0,5.2,5.2,0,0,1,2.58,1.9A5.3,5.3,0,0,1,20,10.67a5.16,5.16,0,0,1-2.6,4.13,1,1,0,0,0,0,1Z"/>
    </svg>
);

const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4285F4" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#34A853" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l0.001-0.001l-0.001,0.001l5.657,5.657C39.321,34.048,44,27.935,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FBBC05" d="M10.165,29.957c-0.652-1.956-1.024-4.06-1.024-6.237s0.372-4.281,1.024-6.237l-5.657-5.657C2.353,15.566,1,19.663,1,24s1.353,8.434,4.508,11.614L10.165,29.957z"></path>
        <path fill="#EA4335" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-5.657-5.657c-1.746,1.17-3.956,1.85-6.451,1.85c-4.422,0-8.211-2.828-9.824-6.694l-5.657,5.657C10.743,39.351,16.82,44,24,44z"></path>
        <path fill="none" d="M1,1h46v46H1z"></path>
    </svg>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full text-center bg-slate-800 border border-slate-700 rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex justify-center mb-4">
                <ToothIcon />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">OralBio <span className="text-cyan-400">AI</span></h1>
            <p className="text-slate-400 mb-8">{isSignUp ? "Create your account to get started." : "Welcome back! Sign in to continue."}</p>
            
            {isSignUp ? (
                <>
                    <div className="space-y-4">
                        <button
                            onClick={() => onLogin('google')}
                            className="w-full bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            <GoogleIcon />
                            Sign up with Google
                        </button>
                        <button
                            onClick={() => onLogin('guest')}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 px-6 rounded-lg transition duration-200"
                        >
                            Continue as Guest
                        </button>
                    </div>
                    <p className="mt-6 text-sm text-slate-400">
                        Already have an account?{' '}
                        <button onClick={() => setIsSignUp(false)} className="font-medium text-cyan-400 hover:underline">
                            Sign In
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <div className="space-y-4">
                        <button
                            onClick={() => onLogin('google')}
                            className="w-full bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            <GoogleIcon />
                            Sign in with Google
                        </button>
                    </div>
                    <p className="mt-6 text-sm text-slate-400">
                        Don't have an account?{' '}
                        <button onClick={() => setIsSignUp(true)} className="font-medium text-cyan-400 hover:underline">
                            Sign Up
                        </button>
                    </p>
                </>
            )}

        </div>
         <footer className="text-center p-4 text-slate-500 text-sm mt-8 max-w-md">
            <p>Disclaimer: This is an AI-powered tool and not a substitute for professional medical advice. Always consult with a qualified healthcare provider.</p>
        </footer>
    </div>
  );
};

export default Login;