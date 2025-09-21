import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { mockProfiles } from './data/mockProfiles';
import { UserProfile, ProfileData, SymptomCheckerState, Page, Habit } from './types';
import PersonalizedPlanComponent from './components/PersonalizedPlan';
import SymptomChecker from './components/SymptomChecker';
import EducationalContent from './components/EducationalContent';
import { generatePersonalizedPlan } from './services/geminiService';
import Login from './components/Login';
import FindDentist from './components/FindDentist';
import SmileDesignStudio from './components/SmileDesignStudio';
import UserProfilePage from './components/UserProfilePage';
import HabitHistory from './components/HabitHistory';

const guestProfile: UserProfile = {
  id: 'guest',
  name: 'Guest',
  salivaPH: 7.0,
  geneticRisk: 'Low',
  bruxism: 'None',
  lifestyle: 'Exploring the application.',
  goals: 'See what OralBio AI can do.',
  avatarUrl: 'https://images.unsplash.com/photo-1549078642-b2c444611bf5?q=80&w=2070&auto=format&fit=crop',
  bio: 'Curious about oral biohacking',
  joinDate: new Date().getFullYear().toString(),
  email: 'guest@example.com',
  phone: 'N/A',
  gender: 'Other',
  dateOfBirth: 'N/A',
  height: 0,
  weight: 0,
  bloodType: 'N/A',
  dietaryRestrictions: 'N/A',
  allergies: 'N/A',
  medications: 'N/A',
  doctorName: 'N/A',
};

const initialHabitsData: Habit[] = [
  // Clinically Proven
  { id: 'h6', name: 'Flossing', time: 'Evening', icon: 'dark_mode', category: 'Clinically Proven' },
  { id: 'h7', name: 'Brushing', time: 'Evening', icon: 'dark_mode', category: 'Clinically Proven' },
  { id: 'h5', name: 'Mouthwash', time: 'Evening', icon: 'dark_mode', category: 'Clinically Proven' },
  
  // Biohacking
  { id: 'h1', name: 'Oil Pulling', time: 'Morning', icon: 'wb_sunny', category: 'Biohacking' },
  { id: 'h2', name: 'Tongue Scraping', time: 'Morning', icon: 'wb_sunny', category: 'Biohacking' },
  { id: 'h3', name: 'Probiotic Rinse', time: 'Morning', icon: 'wb_sunny', category: 'Biohacking' },
  { id: 'h4', name: 'Vitamin D3/K2', time: 'Morning', icon: 'wb_sunny', category: 'Biohacking' },
  { id: 'h8', name: 'Oral Probiotic', time: 'Evening', icon: 'dark_mode', category: 'Biohacking' },
  { id: 'h9', name: 'Magnesium', time: 'Evening', icon: 'dark_mode', category: 'Biohacking' },
  { id: 'h10', name: 'Avoid Blue Light', time: 'Evening', icon: 'dark_mode', category: 'Biohacking' },
];

const BottomNavItem: React.FC<{label: string, icon: string, isActive: boolean, onClick: () => void}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-white bg-blue-600';
  const inactiveClasses = 'text-gray-500';

  return (
    <a onClick={onClick} className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-1 cursor-pointer transition-colors ${isActive ? activeClasses : inactiveClasses}`}>
      <div className={`flex h-8 w-8 items-center justify-center`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <p className={`text-xs font-medium leading-normal tracking-[0.015em]`}>{label}</p>
    </a>
  )
};

const BottomNav: React.FC<{ currentPage: Page; onNavigate: (page: Page) => void; }> = ({ currentPage, onNavigate }) => (
    <div className="flex gap-1 border-t border-gray-200 bg-white/80 backdrop-blur-sm px-2 pb-3 pt-2">
      <BottomNavItem label="Dashboard" icon="dashboard" isActive={currentPage === 'dashboard'} onClick={() => onNavigate('dashboard')} />
      <BottomNavItem label="Plan" icon="list_alt" isActive={currentPage === 'plan'} onClick={() => onNavigate('plan')} />
      <BottomNavItem label="Checker" icon="stethoscope" isActive={currentPage === 'symptom-checker'} onClick={() => onNavigate('symptom-checker')} />
      <BottomNavItem label="Smile" icon="face_retouching_natural" isActive={currentPage === 'smile-design-studio'} onClick={() => onNavigate('smile-design-studio')} />
      <BottomNavItem label="Dentist" icon="local_hospital" isActive={currentPage === 'find-dentist'} onClick={() => onNavigate('find-dentist')} />
      <BottomNavItem label="Learn" icon="school" isActive={currentPage === 'education'} onClick={() => onNavigate('education')} />
      <BottomNavItem label="Profile" icon="person" isActive={currentPage === 'profile'} onClick={() => onNavigate('profile')} />
    </div>
);


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [page, setPage] = useState<Page>('dashboard');
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  
  const [activeProfileId, setActiveProfileId] = useState<string>('');

  const [profilesData, setProfilesData] = useState<Record<string, ProfileData>>(() => {
    const savedData = localStorage.getItem('profilesData');
    return savedData ? JSON.parse(savedData) : {};
  });
  
  useEffect(() => {
    // Auto-login if previously authenticated
    const wasAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (wasAuthenticated) {
        handleLogin(localStorage.getItem('isGuest') === 'true');
    }
  }, []);

  const getActiveProfileData = (): ProfileData => {
    if (!activeProfileId) return {} as ProfileData;
    const defaultSymptomState: SymptomCheckerState = { chat: null, history: [], isLoading: false };
    const data: Partial<ProfileData> = profilesData[activeProfileId] ?? {};

    return {
      plan: data.plan ?? null,
      isPlanLoading: data.isPlanLoading ?? false,
      planError: data.planError ?? null,
      symptomCheckerState: data.symptomCheckerState ?? defaultSymptomState,
      habits: data.habits ?? initialHabitsData,
      habitHistory: data.habitHistory ?? {},
    };
  };

  const updateActiveProfileData = (data: Partial<ProfileData>) => {
    if (!activeProfileId) return;
    setProfilesData(prev => ({
      ...prev,
      [activeProfileId]: {
        ...getActiveProfileData(),
        ...data
      }
    }));
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const activeProfileData = getActiveProfileData();
  
  useEffect(() => {
    if (activeProfileId) {
        localStorage.setItem('activeProfileId', activeProfileId);
    }
    localStorage.setItem('profilesData', JSON.stringify(profilesData));
  }, [activeProfileId, profilesData]);

  const handleGeneratePlan = useCallback(async () => {
    if (!activeProfile) return;
    updateActiveProfileData({ isPlanLoading: true, planError: null });
    try {
      const generatedPlan = await generatePersonalizedPlan(activeProfile);
      updateActiveProfileData({ plan: generatedPlan });
    } catch (err) {
      updateActiveProfileData({ planError: 'Failed to generate plan. Please check your API key and try again.' });
      console.error(err);
    } finally {
      updateActiveProfileData({ isPlanLoading: false });
    }
  }, [activeProfile]);

  const handleToggleHabit = (habitId: string) => {
    if (!activeProfileId) return;

    const currentData = getActiveProfileData();
    const today = new Date().toISOString().split('T')[0];
    const newHistory = { ...currentData.habitHistory };
    const todaysCompletions = newHistory[today] ? [...newHistory[today]] : [];
    const habitIndex = todaysCompletions.indexOf(habitId);

    if (habitIndex > -1) {
        // If habit exists, remove it (uncheck)
        todaysCompletions.splice(habitIndex, 1);
    } else {
        // If habit doesn't exist, add it (check)
        todaysCompletions.push(habitId);
    }

    if (todaysCompletions.length > 0) {
        newHistory[today] = todaysCompletions;
    } else {
        // Clean up empty entries in history for the day
        delete newHistory[today];
    }

    updateActiveProfileData({ habitHistory: newHistory });
  };


  const handleLogin = (asGuest: boolean) => {
    if (asGuest) {
      setProfiles([guestProfile]);
      setActiveProfileId(guestProfile.id);
      setIsGuest(true);
      localStorage.setItem('isGuest', 'true');
    } else {
      setProfiles(mockProfiles);
      const lastActiveId = localStorage.getItem('activeProfileId');
      setActiveProfileId(lastActiveId && lastActiveId !== 'guest' ? lastActiveId : mockProfiles[0].id);
      setIsGuest(false);
      localStorage.setItem('isGuest', 'false');
    }
    setIsAuthenticated(true);
    setPage('dashboard');
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsGuest(false);
    setActiveProfileId('');
    setProfiles([]);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isGuest');
  };
  
  const handleNavigate = (page: Page) => {
    setPage(page);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(p => (p.id === updatedProfile.id ? updatedProfile : p))
    );
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }
  
  if (!activeProfile) {
    return null; 
  }

  const renderPage = () => {
    switch (page) {
      case 'plan':
        return <div className="p-4"><PersonalizedPlanComponent 
                  plan={activeProfileData.plan}
                  isLoading={activeProfileData.isPlanLoading}
                  onGeneratePlan={handleGeneratePlan}
                  error={activeProfileData.planError}
                /></div>;
      case 'smile-design-studio':
        return <div className="p-4"><SmileDesignStudio /></div>;
      case 'find-dentist':
        return <div className="p-4"><FindDentist /></div>;
      case 'education':
        return <div className="p-4"><EducationalContent /></div>;
      case 'profile':
        return <UserProfilePage profile={activeProfile} onUpdateProfile={handleUpdateProfile} />;
      case 'habit-history':
        return <HabitHistory
                  habits={activeProfileData.habits}
                  habitHistory={activeProfileData.habitHistory}
               />;
      case 'symptom-checker':
        return <SymptomChecker 
                  state={activeProfileData.symptomCheckerState} 
                  setState={(updater) => {
                    const newState = typeof updater === 'function' 
                      ? updater(activeProfileData.symptomCheckerState) 
                      : updater;
                    updateActiveProfileData({ symptomCheckerState: newState });
                  }}
                />;
      case 'dashboard':
      default:
        return <Dashboard 
                  profile={activeProfile} 
                  onNavigate={handleNavigate} 
                  habits={activeProfileData.habits}
                  habitHistory={activeProfileData.habitHistory}
                  onToggleHabit={handleToggleHabit}
                />;
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between">
      <div className="flex flex-col flex-1">
        <Header page={page} onNavigate={handleNavigate} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      <footer className="sticky bottom-0 z-10">
        <BottomNav currentPage={page} onNavigate={handleNavigate} />
        <div className="h-5 bg-white/80 backdrop-blur-sm"></div>
      </footer>
    </div>
  );
};

export default App;