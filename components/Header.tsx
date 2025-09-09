import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
    profiles: UserProfile[];
    activeProfileId: string;
    onProfileChange: (profileId: string) => void;
    isGuest: boolean;
    onLogout: () => void;
    onMenuClick: () => void;
}


const ToothIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.34 4.23a2.42 2.42 0 0 1 2.33-2.23h.04a2.42 2.42 0 0 1 2.33 2.23l.1.75c.21 1.63.76 3.23 1.54 4.73.78 1.5.58 3.34-.52 4.54l-.1.1a5.07 5.07 0 0 1-7.14 0l-.1-.1a2.82 2.82 0 0 1-.52-4.54c.78-1.5 1.33-3.1 1.54-4.73l.1-.75Z" />
    <path d="M10.25 15.58c.84-.71 1.76-1.08 2.75-1.08s1.91.37 2.75 1.08" />
    <path d="M12 22v-3" />
    <path d="M7 22h10" />
  </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ profiles, activeProfileId, onProfileChange, isGuest, onLogout, onMenuClick }) => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-20 border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
             <button onClick={onMenuClick} className="p-2 -ml-2 rounded-md text-gray-300 hover:bg-slate-700 lg:hidden" aria-label="Open sidebar">
              <MenuIcon />
            </button>
            <div className='flex items-center space-x-3'>
                <ToothIcon />
                <h1 className="text-2xl font-bold text-white">OralBio <span className="text-cyan-400">AI</span></h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isGuest ? (
                <span className="text-white font-semibold px-2.5">Guest Mode</span>
            ) : (
                <select
                    value={activeProfileId}
                    onChange={(e) => onProfileChange(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    aria-label="Select user profile"
                >
                    {profiles.map(profile => (
                        <option key={profile.id} value={profile.id}>
                            {profile.name}
                        </option>
                    ))}
                </select>
            )}
            <button
              onClick={onLogout}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg text-sm transition duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
