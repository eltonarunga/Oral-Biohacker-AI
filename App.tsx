import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { mockProfiles } from './data/mockProfiles';
import { UserProfile, ProfileData, SymptomCheckerState } from './types';
import PersonalizedPlanComponent from './components/PersonalizedPlan';
import SymptomChecker from './components/SymptomChecker';
import EducationalContent from './components/EducationalContent';
import { generatePersonalizedPlan } from './services/geminiService';
import Login from './components/Login';
import FindDentist from './components/FindDentist';

type Page = 'dashboard' | 'plan' | 'symptom-checker' | 'education' | 'find-dentist';

const guestProfile: UserProfile = {
  id: 'guest',
  name: 'Guest',
  salivaPH: 7.0,
  geneticRisk: 'Low',
  bruxism: 'None',
  lifestyle: 'Exploring the application.',
  goals: 'See what OralBio AI can do.',
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [page, setPage] = useState<Page>('dashboard');
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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

  const getActiveProfileData = () => {
    if (!activeProfileId) return {} as ProfileData; // Return empty if no active profile
    const defaultSymptomState: SymptomCheckerState = { chat: null, history: [], isLoading: false };
    return profilesData[activeProfileId] ?? {
      plan: null,
      isPlanLoading: false,
      planError: null,
      symptomCheckerState: defaultSymptomState,
      habitStreak: 0,
      lastLoggedDate: null,
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

  const handleProfileChange = (profileId: string) => {
    setActiveProfileId(profileId);
    setPage('dashboard'); 
  };
  
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    // In a real app, this would be an API call.
    console.log("Profile updated:", updatedProfile);
    setProfiles(prevProfiles => prevProfiles.map(p => p.id === updatedProfile.id ? updatedProfile : p));
  };

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
    // We can leave activeProfileId and profilesData for when the user signs back in
  };
  
  const handleNavigate = (page: Page) => {
    setPage(page);
    setIsSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }
  
  if (!activeProfile) {
    // Can show a loading state here, but for now, it's a quick transition
    return null; 
  }

  const renderPage = () => {
    switch (page) {
      case 'plan':
        return <PersonalizedPlanComponent 
                  plan={activeProfileData.plan}
                  isLoading={activeProfileData.isPlanLoading}
                  onGeneratePlan={handleGeneratePlan}
                  error={activeProfileData.planError}
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
      case 'find-dentist':
        return <FindDentist />;
      case 'education':
        return <EducationalContent />;
      case 'dashboard':
      default:
        return <Dashboard 
                profile={activeProfile}
                profileData={activeProfileData}
                onUpdateProfileData={updateActiveProfileData}
                onSaveProfile={handleUpdateProfile}
               />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <Header 
        profiles={profiles}
        activeProfileId={activeProfileId}
        onProfileChange={handleProfileChange}
        isGuest={isGuest}
        onLogout={handleLogout}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex">
        <Sidebar currentPage={page} onNavigate={handleNavigate} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 lg:ml-8">
          {renderPage()}
        </main>
      </div>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Disclaimer: This is an AI-powered tool and not a substitute for professional medical advice. Always consult with a qualified healthcare provider.</p>
      </footer>
    </div>
  );
};

export default App;
