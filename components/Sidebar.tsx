
import React from 'react';
import { Page, UserProfile } from '../types';
import { NAV_ITEMS } from '../App';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLogout: () => void;
}

const ToothIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71,7.44a7.21,7.21,0,0,0-3.47-3.47A7.3,7.3,0,0,0,12,3,7.3,7.3,0,0,0,8.76,4,7.21,7.21,0,0,0,5.29,7.44,7.3,7.3,0,0,0,4,10.67,7.15,7.15,0,0,0,7.69,16l-2.5,4.33A1,1,0,0,0,6.06,22H17.94a1,1,0,0,0,.87-1.67L16.31,16a7.15,7.15,0,0,0,3.69-5.33A7.3,7.3,0,0,0,18.71,7.44ZM17.2,20H6.8L8.73,16.8a1,1,0,0,0,0-1,5.16,5.16,0,0,1-2.6-4.13,5.3,5.3,0,0,1,1-3.13,5.2,5.2,0,0,1,2.58-1.9,5.31,5.31,0,0,1,6.54,0,5.2,5.2,0,0,1,2.58,1.9A5.3,5.3,0,0,1,20,10.67a5.16,5.16,0,0,1-2.6,4.13,1,1,0,0,0,0,1Z"/>
    </svg>
);


const NavItem: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void;}> = ({ icon, label, isActive, onClick }) => {
    const activeClasses = 'bg-slate-700 text-white';
    const inactiveClasses = 'text-slate-400 hover:bg-slate-800 hover:text-white';
    return (
        <li>
            <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className={`flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}>
                <span className="material-symbols-outlined w-6 text-center">{icon}</span>
                <span className="ml-3">{label}</span>
            </a>
        </li>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose, user, onLogout }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
       <aside 
         className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 transition-transform duration-300 ease-in-out transform lg:relative lg:inset-auto lg:z-auto lg:translate-x-0 lg:flex-shrink-0 border-r border-slate-800 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
         aria-label="Sidebar"
       >
        <div className="flex flex-col h-full">
            <div className="p-4 flex items-center gap-3 border-b border-slate-800">
                <ToothIcon />
                <h2 className="text-xl font-bold text-white">OralBio <span className="text-cyan-400">AI</span></h2>
            </div>
            <div className="overflow-y-auto flex-1 p-3">
                <ul className="space-y-2">
                    {NAV_ITEMS.map(item => (
                         <NavItem 
                            key={item.page}
                            icon={item.icon}
                            label={item.label} 
                            isActive={currentPage === item.page} 
                            onClick={() => onNavigate(item.page)} 
                        />
                    ))}
                </ul>
            </div>

            <div className="p-3 border-t border-slate-800">
                 <div className="p-3 bg-slate-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={user.avatarUrl} alt="User avatar" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="text-slate-400 hover:text-white" aria-label="Log out">
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                 </div>
            </div>
        </div>
    </aside>
    </>
  );
};