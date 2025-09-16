
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
};

const initialHabitsData: Habit[] = [
  { id: 'h1', name: 'Oil Pulling', time: 'Morning', completed: true, icon: 'wb_sunny' },
  { id: 'h2', name: 'Tongue Scraping', time: 'Morning', completed: true, icon: 'wb_sunny' },
  { id: 'h3', name: 'Probiotic Rinse', time: 'Morning', completed: true, icon: 'wb_sunny' },
  { id: 'h4', name: 'Vitamin D3/K2', time: 'Morning', completed: false, icon: 'wb_sunny' },
  { id: 'h5', name: 'Mouthwash', time: 'Evening', completed: true, icon: 'dark_mode' },
  { id: 'h6', name: 'Flossing', time: 'Evening', completed: true, icon: 'dark_mode' },
  { id: 'h7', name: 'Brushing', time: 'Evening', completed: false, icon: 'dark_mode' },
  { id: 'h8', name: 'Oral Probiotic', time: 'Evening', completed: true, icon: 'dark_mode' },
  { id: 'h9', name: 'Magnesium', time: 'Evening', completed: false, icon: 'dark_mode' },
  { id: 'h10', name: 'Avoid Blue Light', time: 'Evening', completed: false, icon: 'dark_mode' },
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
    // FIX: Explicitly type `data` to inform TypeScript that its properties might be undefined,
    // which aligns with the use of nullish coalescing operators below.
    const data: Partial<ProfileData> = profilesData[activeProfileId] ?? {};

    return {
      plan: data.plan ?? null,
      isPlanLoading: data.isPlanLoading ?? false,
      planError: data.planError ?? null,
      symptomCheckerState: data.symptomCheckerState ?? defaultSymptomState,
      habitStreak: data.habitStreak ?? 0,
      lastLoggedDate: data.lastLoggedDate ?? null,
      habits: data.habits ?? initialHabitsData.map(h => ({...h, completed: false})),
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
  }, [activeProfile, activeProfileId]);

  const handleToggleHabit = (habitId: string) => {
    if (!activeProfileId) return;

    const currentData = getActiveProfileData();
    const { habits, habitStreak, lastLoggedDate } = currentData;
    
    let toggledHabitCompleted = false;
    const newHabits = habits.map(h => {
        if (h.id === habitId) {
            toggledHabitCompleted = !h.completed;
            return { ...h, completed: !h.completed };
        }
        return h;
    });

    if (toggledHabitCompleted) {
        const today = new Date().toISOString().split('T')[0];

        if (today !== lastLoggedDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            const newStreak = lastLoggedDate === yesterdayStr ? (habitStreak || 0) + 1 : 1;

            updateActiveProfileData({
                habits: newHabits,
                habitStreak: newStreak,
                lastLoggedDate: today,
            });
        } else {
            updateActiveProfileData({ habits: newHabits });
        }
    } else {
        updateActiveProfileData({ habits: newHabits });
    }
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
  
  if (page === 'profile') {
    return <UserProfilePage profile={activeProfile} onNavigate={handleNavigate} onUpdateProfile={handleUpdateProfile} />;
  }

  if (page === 'symptom-checker') {
    return <SymptomChecker 
              state={activeProfileData.symptomCheckerState} 
              setState={(updater) => {
                const newState = typeof updater === 'function' 
                  ? updater(activeProfileData.symptomCheckerState) 
                  : updater;
                updateActiveProfileData({ symptomCheckerState: newState });
              }} 
              onNavigate={handleNavigate}
            />;
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
      case 'dashboard':
      default:
        return <Dashboard 
                  profile={activeProfile} 
                  onNavigate={handleNavigate} 
                  habits={activeProfileData.habits}
                  habitStreak={activeProfileData.habitStreak}
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
