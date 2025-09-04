import React from 'react';

type Page = 'dashboard' | 'education';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const EducationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;


const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void;}> = ({ icon, label, isActive, onClick }) => {
    const activeClasses = 'bg-slate-700 text-white';
    const inactiveClasses = 'text-slate-400 hover:bg-slate-800 hover:text-white';
    return (
        <li>
            <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className={`flex items-center p-4 text-base font-normal rounded-lg transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}>
                {icon}
                <span className="ml-3">{label}</span>
            </a>
        </li>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
       <aside 
         className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 transition-transform duration-300 ease-in-out transform lg:relative lg:inset-auto lg:z-auto lg:w-64 lg:translate-x-0 lg:flex-shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
         aria-label="Sidebar"
       >
        <div className="overflow-y-auto py-4 px-3 h-full relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-400 hover:bg-slate-700 rounded-full lg:hidden" aria-label="Close sidebar">
              <XIcon />
            </button>
            <ul className="space-y-3 pt-12 lg:pt-0">
                <NavItem icon={<DashboardIcon/>} label="Dashboard" isActive={currentPage === 'dashboard'} onClick={() => onNavigate('dashboard')} />
                <NavItem icon={<EducationIcon/>} label="Education" isActive={currentPage === 'education'} onClick={() => onNavigate('education')} />
            </ul>
        </div>
    </aside>
    </>
  );
};
