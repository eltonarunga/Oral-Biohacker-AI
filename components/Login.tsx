import React, { useState, useEffect } from 'react';
import { GoogleCredentialResponse } from '../types';
import { Spinner } from './common/Spinner';

interface LoginProps {
  onGoogleLogin: (response: GoogleCredentialResponse) => void;
  onGuestLogin: () => void;
  onEmailSignUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onEmailSignIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  theme: 'light' | 'dark';
}

declare global {
  interface Window {
    google: any;
  }
}

const GoogleIcon = () => (
    <svg height="24" viewBox="0 0 48 48" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"></path><path d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"></path><path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.356-11.303-7.962l-6.571 4.819C9.656 39.663 16.318 44 24 44z" fill="#4CAF50"></path><path d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.574l6.19 5.238C42.022 35.318 44 30.034 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"></path></svg>
);

const AppleIcon = () => (
    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 15.61c-.34.12-.7.23-1.08.33c-.39.1-.79.16-1.21.16c-.55 0-1.07-.08-1.57-.23c-.5-.15-.95-.38-1.35-.68c-.4-.3-.74-.68-1.02-1.12c-.28-.44-.42-.95-.42-1.52c0-.6.15-1.12.44-1.56c.29-.44.67-.79 1.14-.07c.47-.28.99-.42 1.57-.42c.56 0 1.07.08 1.54.25c.47.16.87.39 1.22.68c.18-.29.27-.6.27-.94c0-.55-.16-1.02-.49-1.42c-.33-.4-.76-.6-1.28-.6c-.4 0-.79.1-1.15.3c-.36.2-.72.5-1.07.89c-.68.78-1.24 1.17-1.68 1.17c-.19 0-.36-.06-.5-.17c-.14-.11-.22-.27-.22-.47c0-.23.11-.47.33-.71c.22-.24.5-.48.83-.73c.33-.25.68-.48.06-.69c.38-.21.78-.37 1.2-.47c.42-.1.85-.16 1.3-.16c.72 0 1.38.16 1.96.48c.58.32 1.03.77 1.34 1.35c.31.58.47 1.22.47 1.91v4.45c0 .41.05.76.14 1.05c.09.29.23.54.4.73c.12.13.26.19.42.19c.23 0 .44-.1.62-.29c.18-.19.27-.43.27-.72c0-.3-.1-.58-.3-.84c-.2-.26-.45-.51-.76-.75m-4.52.27c.36 0 .7-.06 1.02-.17c.32-.11.6-.28.84-.5c.24-.22.43-.5.57-.83c.14-.33.21-.7.21-1.1c0-.36-.07-.7-.2-1.02c-.13-.32-.32-.58-.55-.78c-.23-.2-.5-.35-.82-.45c-.32-.1-.65-.15-1.01-.15c-.36 0-.7.05-1.01.15c-.31.1-.59.25-.83.45c-.24.2-.43.46-.57.78c-.14.32-.21.66-.21 1.02c0 .4.08.77.23 1.1c.15.33.35.6.6.83c.25.22.54.39.87.5c.33.11.69.17 1.07.17M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2Z" fill="currentColor"></path></svg>
);


const Login: React.FC<LoginProps> = ({ onGoogleLogin, onGuestLogin, onEmailSignUp, onEmailSignIn, theme }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [googleInitError, setGoogleInitError] = useState<string | null>(null);
  const googleButtonContainerRef = React.useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const isGoogleSignInAvailable = !!process.env.GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!isGoogleSignInAvailable) {
      return;
    }

    if (window.google?.accounts?.id && googleButtonContainerRef.current) {
        try {
            setGoogleInitError(null);
            window.google.accounts.id.initialize({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                callback: onGoogleLogin
            });
            window.google.accounts.id.renderButton(
                googleButtonContainerRef.current,
                { theme: theme === 'dark' ? 'filled_black' : 'outline', size: "large", type: "standard", text: isSignUp ? 'signup_with' : 'signin_with', width: '300' } 
            );
        } catch (error) {
            console.error("Google Sign-In initialization error:", error);
            setGoogleInitError("Failed to load Google Sign-In.");
        }
    } else {
        console.warn("Google Identity Services script not loaded yet.");
    }
  }, [isSignUp, theme, onGoogleLogin, isGoogleSignInAvailable]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError("Please enter a valid email address.");
        return;
    }

    if (isSignUp) {
        if (password.length < 6) {
             setError("Password must be at least 6 characters long.");
             return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        const result = await onEmailSignUp(email, password);
        if (result.error) {
            setError(result.error);
        }
        // On success, the App component will handle navigation via state change
    } else {
        if (!password) {
            setError("Please enter your password.");
             return;
        }
        setIsLoading(true);
        const result = await onEmailSignIn(email, password);
        if (result.error) {
            setError(result.error);
        }
    }
    setIsLoading(false);
  };


  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="px-4 pt-8 max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark tracking-tight">{isSignUp ? 'Create your account' : 'Sign In'}</h1>
          <p className="text-subtle-light dark:text-subtle-dark mt-2">{isSignUp ? 'Start your personalized oral biohacking journey.' : 'Welcome back! Sign in to continue.'}</p>
        </div>
        
        {error && <p className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-sm p-3 rounded-lg text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} className="w-full h-14 px-4 bg-input-light dark:bg-input-dark border border-subtle-light/20 dark:border-subtle-dark/20 rounded-lg text-foreground-light dark:text-foreground-dark placeholder-subtle-light dark:placeholder-subtle-dark focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50" id="email" placeholder="Email" type="email"/>
            </div>
            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} className="w-full h-14 px-4 bg-input-light dark:bg-input-dark border border-subtle-light/20 dark:border-subtle-dark/20 rounded-lg text-foreground-light dark:text-foreground-dark placeholder-subtle-light dark:placeholder-subtle-dark focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50" id="password" placeholder="Password" type="password"/>
            </div>
            {isSignUp && (
               <div>
                  <label className="sr-only" htmlFor="confirm-password">Confirm Password</label>
                  <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={isLoading} className="w-full h-14 px-4 bg-input-light dark:bg-input-dark border border-subtle-light/20 dark:border-subtle-dark/20 rounded-lg text-foreground-light dark:text-foreground-dark placeholder-subtle-light dark:placeholder-subtle-dark focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50" id="confirm-password" placeholder="Confirm Password" type="password"/>
               </div>
            )}
          </div>
          <div className="mt-6">
            <button type="submit" disabled={isLoading} className="w-full h-14 bg-primary text-white font-bold rounded-lg text-lg flex items-center justify-center disabled:opacity-50">
              {isLoading ? <Spinner variant="white" size="sm" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </div>
        </form>
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-subtle-light/20 dark:border-subtle-dark/20"></div>
          <span className="flex-shrink mx-4 text-subtle-light dark:text-subtle-dark text-sm">OR</span>
          <div className="flex-grow border-t border-subtle-light/20 dark:border-subtle-dark/20"></div>
        </div>
        <div className="space-y-4">
            {isGoogleSignInAvailable ? (
                 <>
                    <div ref={googleButtonContainerRef} className="flex justify-center h-[44px]"></div>
                    {googleInitError && <p className="text-red-400 text-xs text-center">{googleInitError}</p>}
                </>
            ) : (
                <button disabled title="Google Sign-In is not configured." className="w-full h-14 bg-primary/10 dark:bg-primary/20 text-primary font-bold rounded-lg text-lg flex items-center justify-center gap-3 disabled:opacity-50">
                    <GoogleIcon />
                    {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
                </button>
            )}
          
            <button disabled title="Apple sign in coming soon!" className="w-full h-14 bg-primary/10 dark:bg-primary/20 text-primary font-bold rounded-lg text-lg flex items-center justify-center gap-3 disabled:opacity-50">
                <AppleIcon />
                {isSignUp ? 'Sign up with Apple' : 'Sign in with Apple'}
            </button>
            <button onClick={onGuestLogin} className="w-full h-14 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg text-base">
                Continue as Guest
            </button>
        </div>
      </div>
      <div className="px-4 pb-8 pt-4 text-center">
        <p className="text-sm text-subtle-light dark:text-subtle-dark">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button onClick={() => setIsSignUp(!isSignUp)} className="font-bold text-primary ml-1 hover:underline">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;