import React, { useState, useEffect } from 'react';
import { GoogleCredentialResponse } from '../types';
import { Spinner } from './common/Spinner';
import { LoginIllustration } from './common/illustrations/LoginIllustration';

interface LoginProps {
  onGoogleLogin: (response: GoogleCredentialResponse) => Promise<void>;
  onGuestLogin: () => void;
  onEmailSignUp: (email: string, password: string) => Promise<void>;
  onEmailSignIn: (email: string, password: string) => Promise<void>;
  theme: 'light' | 'dark';
}

declare global {
  interface Window {
    google: any;
  }
}

// NOTE: This is a public client ID for client-side authentication.
// It is safe to be exposed in the frontend code.
const GOOGLE_CLIENT_ID = '724142811315-cmelbifnilm0ibmhhncbutqm3799ps4j.apps.googleusercontent.com';

const Login: React.FC<LoginProps> = ({ onGoogleLogin, onGuestLogin, onEmailSignUp, onEmailSignIn, theme }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [googleInitError, setGoogleInitError] = useState<string | null>(null);
  const googleButtonContainerRef = React.useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const isGoogleSignInAvailable = !!GOOGLE_CLIENT_ID;

  const handleGoogleLogin = async (response: GoogleCredentialResponse) => {
    setIsLoading(true);
    setError(null);
    try {
        await onGoogleLogin(response);
    } catch(err) {
        setError(err instanceof Error ? err.message : 'Google login failed.');
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isGoogleSignInAvailable || !window.google?.accounts?.id) {
        if (isGoogleSignInAvailable) console.warn("Google Identity Services script not loaded yet.");
        return;
    }

    if (googleButtonContainerRef.current) {
        try {
            setGoogleInitError(null);
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleLogin
            });
            window.google.accounts.id.renderButton(
                googleButtonContainerRef.current,
                { theme: 'filled_blue', size: "large", type: "standard", shape: 'pill', text: isSignUp ? 'signup_with' : 'signin_with', width: '300' } 
            );
        } catch (err) {
            console.error("Google Sign-In initialization error:", err);
            setGoogleInitError("Failed to load Google Sign-In.");
        }
    }
  }, [isSignUp, theme, isGoogleSignInAvailable]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError("Please enter a valid email address.");
        return;
    }

    setIsLoading(true);
    try {
        if (isSignUp) {
            if (password.length < 6) {
                 setError("Password must be at least 6 characters long.");
                 return;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            await onEmailSignUp(email, password);
        } else {
            if (!password) {
                setError("Please enter your password.");
                 return;
            }
            await onEmailSignIn(email, password);
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark">
        <div className="hidden lg:flex flex-1 items-center justify-center p-12">
            <div className="max-w-md w-full">
                <LoginIllustration />
                 <div className="mt-8 text-center">
                    <h2 className="text-3xl font-bold">Unlock Your Oral Health Potential</h2>
                    <p className="mt-2 text-subtle-light dark:text-subtle-dark">Personalized insights, powered by AI.</p>
                </div>
            </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
             <div className="p-4 sm:p-8 max-w-sm mx-auto w-full">
                <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{isSignUp ? 'Create your account' : 'Sign In'}</h1>
                <p className="text-subtle-light dark:text-subtle-dark mt-2">{isSignUp ? 'Start your personalized oral biohacking journey.' : 'Welcome back! Sign in to continue.'}</p>
                </div>
                
                {error && <p className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg text-center mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <input value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} className="w-full h-12 px-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg placeholder-subtle-light dark:placeholder-subtle-dark focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50" id="email" placeholder="Email" type="email"/>
                    <input value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} className="w-full h-12 px-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg placeholder-subtle-light dark:placeholder-subtle-dark focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50" id="password" placeholder="Password" type="password"/>
                    {isSignUp && (
                        <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={isLoading} className="w-full h-12 px-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg placeholder-subtle-light dark:placeholder-subtle-dark focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50" id="confirm-password" placeholder="Confirm Password" type="password"/>
                    )}
                </div>
                <div className="mt-6">
                    <button type="submit" disabled={isLoading} className="w-full h-12 bg-primary text-white font-bold rounded-lg text-lg flex items-center justify-center disabled:opacity-50 transition-all hover:shadow-glow hover:scale-105">
                    {isLoading ? <Spinner variant="white" size="sm" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                </div>
                </form>
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-black/10 dark:border-white/10"></div>
                    <span className="flex-shrink mx-4 text-subtle-light dark:text-subtle-dark text-sm">OR</span>
                    <div className="flex-grow border-t border-black/10 dark:border-white/10"></div>
                </div>
                <div className="space-y-4">
                    {isGoogleSignInAvailable ? (
                        <>
                            <div ref={googleButtonContainerRef} className="flex justify-center h-[44px]"></div>
                            {googleInitError && <p className="text-red-400 text-xs text-center">{googleInitError}</p>}
                        </>
                    ) : (
                         <button disabled title="Google Sign-In is not configured." className="w-full h-12 border border-black/10 dark:border-white/10 font-semibold rounded-lg text-base flex items-center justify-center gap-3 disabled:opacity-50">
                            Continue with Google
                        </button>
                    )}
                
                    <button onClick={onGuestLogin} className="w-full h-12 border border-black/10 dark:border-white/10 font-semibold rounded-lg text-base">
                        Continue as Guest
                    </button>
                </div>
                <div className="pt-8 text-center">
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    <button onClick={() => setIsSignUp(!isSignUp)} className="font-bold text-primary ml-1 hover:underline">
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;