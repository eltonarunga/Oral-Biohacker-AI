import React from 'react';

type Page = 'dashboard' | 'plan' | 'symptom-checker' | 'education' | 'find-dentist' | 'smile-design-studio';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const PlanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const SmileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const EducationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const DentistIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12l-3.5-4.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12l3.5-4.5" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;


const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void;}> = ({ icon, label, isActive, onClick }) => {
    const activeClasses = 'bg-slate-700 text-white';
    const inactiveClasses = 'text-slate-400 hover:bg-slate-800 hover:text-white';
    return (
        <li>
            <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className={`flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}>
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
            <ul className="space-y-2 pt-12 lg:pt-0">
                <NavItem icon={<DashboardIcon/>} label="Dashboard" isActive={currentPage === 'dashboard'} onClick={() => onNavigate('dashboard')} />
                <NavItem icon={<PlanIcon/>} label="Personalized Plan" isActive={currentPage === 'plan'} onClick={() => onNavigate('plan')} />
                <NavItem icon={<ChatIcon/>} label="Symptom Checker" isActive={currentPage === 'symptom-checker'} onClick={() => onNavigate('symptom-checker')} />
                <NavItem icon={<SmileIcon/>} label="Smile Design Studio" isActive={currentPage === 'smile-design-studio'} onClick={() => onNavigate('smile-design-studio')} />
                <NavItem icon={<DentistIcon/>} label="Find a Dentist" isActive={currentPage === 'find-dentist'} onClick={() => onNavigate('find-dentist')} />
                <NavItem icon={<EducationIcon/>} label="Education" isActive={currentPage === 'education'} onClick={() => onNavigate('education')} />
            </ul>
        </div>
    </aside>
    </>
  );
};