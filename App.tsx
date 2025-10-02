import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { UserProfile, ProfileData, SymptomCheckerState, Page, Habit, GoogleCredentialResponse, Goal } from './types';
import PersonalizedPlanComponent from './components/PersonalizedPlan';
import SymptomChecker from './components/SymptomChecker';
import EducationalContent from './components/EducationalContent';
import * as api from './services/apiService';
import Login from './components/Login';
import FindDentist from './components/FindDentist';
import SmileDesignStudio from './components/SmileDesignStudio';
import UserProfilePage from './components/UserProfilePage';
import HabitHistory from './components/HabitHistory';
import { getDateString } from './utils/habits';
import { Spinner } from './components/common/Spinner';
import OnboardingWizard from './components/OnboardingWizard';
import { Sidebar } from './components/Sidebar';

// ==================== CONSTANTS ====================

const STORAGE_KEYS = {
  AUTH_TOKEN: 'oralBioAI_authToken',
  THEME: 'theme',
} as const;

const GUEST_PROFILE_DATA: ProfileData = {
    plan: null,
    isPlanLoading: false,
    planError: null,
    symptomCheckerState: { history: [], isLoading: false, suggestedReplies: [] },
    habits: [],
    habitHistory: {},
};

const GUEST_PROFILE: UserProfile = {
  id: 'guest',
  name: 'Guest',
  salivaPH: 7.0,
  geneticRisk: 'Low',
  bruxism: 'None',
  lifestyle: 'Exploring the application.',
  goals: [
    { id: 'g-guest-1', text: 'Learn about oral biohacking', isCompleted: false },
    { id: 'g-guest-2', text: 'Complete first symptom check', isCompleted: false },
  ],
  avatarUrl: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20100%20100%27%3E%3Ccircle%20cx%3D%2750%27%20cy%3D%2750%27%20r%3D%2750%27%20fill%3D%27%23EDE9FE%27%2F%3E%3Ccircle%20cx%3D%2750%27%20cy%3D%2750%27%20r%3D%2740%27%20fill%3D%27%238B5CF6%27%2F%3E%3Cline%20x1%3D%2735%27%20y1%3D%2745%27%20x2%3D%2745%27%20y2%3D%2745%27%20stroke%3D%27white%27%20stroke-width%3D%275%27%20stroke-linecap%3D%27round%27%2F%3E%3Cline%20x1%3D%2755%27%20y1%3D%2745%27%20x2%3D%2765%27%20y2%3D%2745%27%20stroke%3D%27white%27%20stroke-width%3D%275%27%20stroke-linecap%3D%27round%27%2F%3E%3Ccircle%20cx%3D%2750%27%20cy%3D%2765%27%20r%3D%2710%27%20fill%3D%27none%27%20stroke%3D%27white%27%20stroke-width%3D%274%27%2F%3E%3C%2Fsvg%3E',
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

export const NAV_ITEMS: ReadonlyArray<{ page: Page; label: string; icon: string }> = [
  { page: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { page: 'plan', label: 'Plan', icon: 'list_alt' },
  { page: 'symptom-checker', label: 'Checker', icon: 'stethoscope' },
  { page: 'smile-design-studio', label: 'Smile Studio', icon: 'face_retouching_natural' },
  { page: 'find-dentist', label: 'Find Dentist', icon: 'local_hospital' },
  { page: 'education', label: 'Learn', icon: 'school' },
  { page: 'profile', label: 'Profile', icon: 'person' },
];

const BOTTOM_NAV_PAGES: readonly Page[] = [
  'dashboard',
  'plan',
  'symptom-checker',
  'smile-design-studio',
  'profile',
] as const;

// ==================== BOTTOM NAV COMPONENT ====================

interface BottomNavItemProps {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

const BottomNavItem = React.forwardRef<HTMLAnchorElement, BottomNavItemProps>(
  ({ label, icon, isActive, onClick }, ref) => (
    <a
      ref={ref}
      onClick={onClick}
      className={`relative z-10 flex flex-1 flex-col items-center justify-center gap-1 py-2 cursor-pointer transition-colors duration-300 ${
        isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
      }`}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="flex h-7 w-7 items-center justify-center">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <p className="text-xs font-medium leading-normal tracking-[0.015em]">{label}</p>
    </a>
  )
);

BottomNavItem.displayName = 'BottomNavItem';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  const bottomNavItems = useMemo(
    () => NAV_ITEMS.filter(item => BOTTOM_NAV_PAGES.includes(item.page)),
    []
  );

  useEffect(() => {
    const activeIndex = bottomNavItems.findIndex(item => item.page === currentPage);
    const activeItem = itemRefs.current[activeIndex];

    if (activeItem) {
      setIndicatorStyle({
        left: `${activeItem.offsetLeft}px`,
        width: `${activeItem.offsetWidth}px`,
      });
    }
  }, [currentPage, bottomNavItems]);

  return (
    <nav
      className="relative flex h-16 items-stretch gap-1 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-2"
      aria-label="Bottom navigation"
    >
      <div
        className="absolute top-0 bottom-0 my-auto h-[calc(100%-1rem)] bg-blue-600 rounded-lg transition-all duration-300 ease-in-out"
        style={indicatorStyle}
        aria-hidden="true"
      />
      {bottomNavItems.map((item, index) => (
        <BottomNavItem
          key={item.page}
          ref={el => {
            itemRefs.current[index] = el;
          }}
          label={item.label}
          icon={item.icon}
          isActive={currentPage === item.page}
          onClick={() => onNavigate(item.page)}
        />
      ))}
    </nav>
  );
};

// ==================== CUSTOM HOOKS ====================

const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
};

const useAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [isOnboarding, setIsOnboarding] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
            if (token) {
                try {
                    const { user } = await api.fetchUserProfile();
                    if (!user.salivaPH || !user.geneticRisk) { // Check if onboarding is incomplete
                        setIsOnboarding(true);
                    }
                    setCurrentUser(user);
                } catch (error) {
                    console.error("Session validation failed:", error);
                    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                }
            }
            setIsLoading(false);
        };
        validateToken();
    }, []);

    const handleAuthentication = useCallback((token: string, user: UserProfile) => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        if (!user.salivaPH || !user.geneticRisk) {
             setIsOnboarding(true);
        } else {
             setIsOnboarding(false);
        }
        setCurrentUser(user);
    }, []);

    const handleGoogleLogin = useCallback(async (response: GoogleCredentialResponse) => {
        if (!response.credential) throw new Error("Google login failed.");
        const { token, user } = await api.exchangeGoogleCredential(response.credential);
        handleAuthentication(token, user);
    }, [handleAuthentication]);

    const handleEmailSignUp = useCallback(async (email: string, password: string) => {
        const { token, user } = await api.signUpWithEmail(email, password);
        handleAuthentication(token, user);
    }, [handleAuthentication]);

    const handleEmailSignIn = useCallback(async (email: string, password: string) => {
        const { token, user } = await api.signInWithEmail(email, password);
        handleAuthentication(token, user);
    }, [handleAuthentication]);
    
    const handleGuestLogin = useCallback(() => {
        setCurrentUser(GUEST_PROFILE);
        setIsOnboarding(false);
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
        setIsOnboarding(false);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        // Here you might also call a backend logout endpoint
    }, []);

    const completeOnboarding = useCallback(async (updatedProfileData: Partial<UserProfile>) => {
        if (!currentUser) return;
        const profileToUpdate = { ...currentUser, ...updatedProfileData };
        try {
            const { user: updatedUser } = await api.updateUserProfile(profileToUpdate);
            setCurrentUser(updatedUser);
            setIsOnboarding(false);
        } catch (error) {
            console.error("Failed to save onboarding data:", error);
            // Optionally show an error to the user
        }
    }, [currentUser]);

    return {
        isLoading,
        currentUser,
        isOnboarding,
        handleGuestLogin,
        handleGoogleLogin,
        handleEmailSignUp,
        handleEmailSignIn,
        logout,
        completeOnboarding,
    };
};

const useProfileData = (currentUser: UserProfile | null) => {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (currentUser && currentUser.id !== 'guest') {
                setIsLoading(true);
                try {
                    const data = await api.fetchProfileData();
                    setProfileData(data);
                } catch (error) {
                    console.error("Failed to fetch profile data:", error);
                    setProfileData(null); // Or set to a default error state
                } finally {
                    setIsLoading(false);
                }
            } else if (currentUser?.id === 'guest') {
                setProfileData(GUEST_PROFILE_DATA);
                setIsLoading(false);
            } else {
                setProfileData(null);
                setIsLoading(false);
            }
        };
        loadData();
    }, [currentUser]);

    const updateProfileData = useCallback((data: Partial<ProfileData>) => {
        if (!currentUser || currentUser.id === 'guest') return;
        
        setProfileData(prev => {
            if (!prev) return null;
            const newData = { ...prev, ...data };
            // Here you would also call an API to persist the changes to the backend
            // e.g., api.updateProfileData(newData);
            return newData;
        });
    }, [currentUser]);

    return { profileData, isLoading, updateProfileData };
};

// ==================== MAIN APP COMPONENT ====================

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { 
    isLoading: isAuthLoading, 
    currentUser, 
    isOnboarding, 
    handleGuestLogin, 
    handleGoogleLogin, 
    handleEmailSignUp,
    handleEmailSignIn,
    logout, 
    completeOnboarding 
  } = useAuth();
  const { profileData, isLoading: isDataLoading, updateProfileData } = useProfileData(currentUser);
  
  const [page, setPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const activeProfileData = useMemo(() => {
    if (currentUser?.id === 'guest') return GUEST_PROFILE_DATA;
    return profileData;
  }, [currentUser, profileData]);


  const handleGeneratePlan = useCallback(async () => {
    if (!currentUser || currentUser.id === 'guest') return;
    
    updateProfileData({ isPlanLoading: true, planError: null });
    
    try {
      const { plan } = await api.generatePlan();
      updateProfileData({ plan });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      updateProfileData({ planError: `Failed to generate plan. ${errorMessage}` });
      console.error('Plan generation error:', err);
    } finally {
      updateProfileData({ isPlanLoading: false });
    }
  }, [currentUser, updateProfileData]);

  const handleToggleHabit = useCallback(
    async (habitId: string) => {
      if (!currentUser || !activeProfileData) return;

      const today = getDateString(new Date());
      // Optimistically update UI
      const originalHistory = activeProfileData.habitHistory;
      const todaysCompletions = originalHistory[today] ? [...originalHistory[today]] : [];
      const habitIndex = todaysCompletions.indexOf(habitId);

      if (habitIndex > -1) {
        todaysCompletions.splice(habitIndex, 1);
      } else {
        todaysCompletions.push(habitId);
      }
      
      const newHistory = { ...originalHistory };
      if (todaysCompletions.length > 0) {
        newHistory[today] = todaysCompletions;
      } else {
        delete newHistory[today];
      }

      updateProfileData({ habitHistory: newHistory });

      // Call API
      try {
        await api.toggleHabit(habitId, today);
      } catch (error) {
        console.error("Failed to update habit:", error);
        // Revert UI on failure
        updateProfileData({ habitHistory: originalHistory });
        // Optionally show an error toast
      }
    },
    [currentUser, activeProfileData, updateProfileData]
  );

  const handleNavigate = useCallback((newPage: Page) => {
    setPage(newPage);
    setIsSidebarOpen(false);
  }, []);

  const handleUpdateProfile = useCallback(
    async (updatedProfile: UserProfile) => {
      if (!currentUser || updatedProfile.id === 'guest') return;
      try {
        await api.updateUserProfile(updatedProfile);
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    },
    [currentUser]
  );
  
  const handleUpdateGoals = useCallback(async (goals: Goal[]) => {
      if (!currentUser || !activeProfileData) return;
      const originalGoals = currentUser.goals;
      handleUpdateProfile({ ...currentUser, goals });

      try {
          await api.updateGoals(goals);
      } catch (error) {
          console.error("Failed to update goals:", error);
          handleUpdateProfile({ ...currentUser, goals: originalGoals }); // Revert
      }
  }, [currentUser, activeProfileData, handleUpdateProfile]);

  const handleExportData = useCallback(async () => {
    if (!currentUser || currentUser.id === 'guest') return;
    try {
        await api.exportUserData();
    } catch (error) {
        console.error("Failed to export data:", error);
    }
  }, [currentUser]);

  const handleDeleteAccount = useCallback(async () => {
    if (!currentUser || currentUser.id === 'guest') return;
     try {
        await api.deleteUserAccount();
        logout();
    } catch (error) {
        console.error("Failed to delete account:", error);
    }
  }, [currentUser, logout]);

  const renderPage = useCallback(() => {
    if (!activeProfileData) return null;
    const pageContainerClass = 'p-4 sm:p-6 lg:p-8';

    switch (page) {
      case 'plan':
        return (
          <div className={pageContainerClass}>
            <PersonalizedPlanComponent
              plan={activeProfileData.plan}
              isLoading={activeProfileData.isPlanLoading}
              onGeneratePlan={handleGeneratePlan}
              error={activeProfileData.planError}
            />
          </div>
        );
      case 'smile-design-studio':
        return (
          <div className={pageContainerClass}>
            <SmileDesignStudio />
          </div>
        );
      case 'find-dentist':
        return (
          <div className={pageContainerClass}>
            <FindDentist />
          </div>
        );
      case 'education':
        return (
          <div className={pageContainerClass}>
            <EducationalContent />
          </div>
        );
      case 'profile':
        return (
          <UserProfilePage
            profile={currentUser!}
            onUpdateProfile={handleUpdateProfile}
            onUpdateGoals={handleUpdateGoals}
            theme={theme}
            onToggleTheme={toggleTheme}
            onExportData={handleExportData}
            onDeleteAccount={handleDeleteAccount}
          />
        );
      case 'habit-history':
        return (
          <HabitHistory
            habits={activeProfileData.habits}
            habitHistory={activeProfileData.habitHistory}
          />
        );
      case 'symptom-checker':
        return (
          <div className="h-full">
            <SymptomChecker
              state={activeProfileData.symptomCheckerState}
              setState={updater => {
                const newState =
                  typeof updater === 'function'
                    ? updater(activeProfileData.symptomCheckerState)
                    : updater;
                updateProfileData({ symptomCheckerState: newState });
              }}
            />
          </div>
        );
      case 'dashboard':
      default:
        return (
          <Dashboard
            profile={currentUser!}
            onNavigate={handleNavigate}
            habits={activeProfileData.habits}
            habitHistory={activeProfileData.habitHistory}
            onToggleHabit={handleToggleHabit}
          />
        );
    }
  }, [
    page,
    currentUser,
    activeProfileData,
    handleGeneratePlan,
    handleUpdateProfile,
    handleUpdateGoals,
    handleNavigate,
    handleToggleHabit,
    theme,
    toggleTheme,
    handleExportData,
    handleDeleteAccount,
    updateProfileData
  ]);

  // Loading state
  if (isAuthLoading || (currentUser && currentUser.id !== 'guest' && isDataLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Spinner />
      </div>
    );
  }

  // Unauthenticated state
  if (!currentUser) {
    const handleAuthAction = async (action: Promise<any>) => {
        try {
            await action;
        } catch (error) {
            throw error; // Re-throw to be caught by Login component's handler
        }
    };
    return <Login 
        onGoogleLogin={(res) => handleAuthAction(handleGoogleLogin(res))}
        onGuestLogin={handleGuestLogin} 
        onEmailSignUp={(email, pass) => handleAuthAction(handleEmailSignUp(email, pass))}
        onEmailSignIn={(email, pass) => handleAuthAction(handleEmailSignIn(email, pass))}
        theme={theme} 
    />;
  }

  // Onboarding state
  if (isOnboarding) {
    return <OnboardingWizard user={currentUser} onComplete={completeOnboarding} />;
  }

  // Main application
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white dark:bg-slate-900 lg:flex-row">
      <Sidebar
        currentPage={page}
        onNavigate={handleNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={currentUser}
        onLogout={logout}
      />
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex flex-1 flex-col">
          <Header
            page={page}
            onNavigate={handleNavigate}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />
          <main className="flex-1 overflow-y-auto">{renderPage()}</main>
        </div>
        <footer className="sticky bottom-0 z-10 lg:hidden">
          <BottomNav currentPage={page} onNavigate={handleNavigate} />
          <div className="h-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm" />
        </footer>
      </div>
    </div>
  );
};
