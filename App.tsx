import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { UserProfile, ProfileData, SymptomCheckerState, Page, Habit, GoogleCredentialResponse } from './types';
import PersonalizedPlanComponent from './components/PersonalizedPlan';
import SymptomChecker from './components/SymptomChecker';
import EducationalContent from './components/EducationalContent';
import { generatePersonalizedPlan } from './services/geminiService';
import Login from './components/Login';
import FindDentist from './components/FindDentist';
import SmileDesignStudio from './components/SmileDesignStudio';
import UserProfilePage from './components/UserProfilePage';
import HabitHistory from './components/HabitHistory';
import { getDateString } from './utils/habits';
import { Spinner } from './components/common/Spinner';
import OnboardingWizard from './components/OnboardingWizard';
import { Sidebar } from './components/Sidebar';
import { predefinedAvatars } from './data/predefinedAvatars';

// ==================== CONSTANTS ====================

const STORAGE_KEYS = {
  USERS_DB: 'oralBioAI_usersDB',
  PROFILES_DATA_DB: 'oralBioAI_profilesDataDB',
  CURRENT_USER_ID: 'oralBioAI_currentUserId',
  THEME: 'theme',
} as const;

const INITIAL_HABITS: Habit[] = [
  { id: 'h6', name: 'Flossing', time: 'Evening', icon: 'dark_mode', category: 'Clinically Proven' },
  { id: 'h7', name: 'Brushing', time: 'Evening', icon: 'dark_mode', category: 'Clinically Proven' },
  { id: 'h5', name: 'Mouthwash', time: 'Evening', icon: 'dark_mode', category: 'Clinically Proven' },
  { id: 'h1', name: 'Oil Pulling', time: 'Morning', icon: 'wb_sunny', category: 'Biohacking' },
  { id: 'h2', name: 'Tongue Scraping', time: 'Morning', icon: 'wb_sunny', category: 'Biohacking' },
  { id: 'h3', name: 'Probiotic Rinse', time: 'Morning', icon: 'wb_sunny', category: 'Biohacking' },
  { id: 'h4', name: 'Vitamin D3/K2', time: 'Morning', icon: 'wb_sunny', category: 'Biohacking' },
  { id: 'h8', name: 'Oral Probiotic', time: 'Evening', icon: 'dark_mode', category: 'Biohacking' },
  { id: 'h9', name: 'Magnesium', time: 'Evening', icon: 'dark_mode', category: 'Biohacking' },
  { id: 'h10', name: 'Avoid Blue Light', time: 'Evening', icon: 'dark_mode', category: 'Biohacking' },
];

const GUEST_PROFILE: UserProfile = {
  id: 'guest',
  name: 'Guest',
  salivaPH: 7.0,
  geneticRisk: 'Low',
  bruxism: 'None',
  lifestyle: 'Exploring the application.',
  goals: [
    { id: 'g-guest-1', text: 'Learn about oil pulling', isCompleted: false },
    { id: 'g-guest-2', text: 'Complete first symptom check', isCompleted: false },
  ],
  avatarUrl: predefinedAvatars[3],
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

// ==================== STORAGE SERVICE ====================

class StorageService {
  static getUsersDB(): Record<string, UserProfile> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS_DB);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading users database:', error);
      return {};
    }
  }

  static saveUsersDB(db: Record<string, UserProfile>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(db));
    } catch (error) {
      console.error('Error saving users database:', error);
    }
  }

  static getProfilesDataDB(): Record<string, ProfileData> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILES_DATA_DB);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading profiles data:', error);
      return {};
    }
  }

  static saveProfilesDataDB(db: Record<string, ProfileData>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILES_DATA_DB, JSON.stringify(db));
    } catch (error) {
      console.error('Error saving profiles data:', error);
    }
  }

  static getCurrentUserId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
  }

  static setCurrentUserId(userId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  static removeCurrentUserId(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  }

  static getTheme(): 'light' | 'dark' {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  static setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
}

// ==================== UTILITY FUNCTIONS ====================

const getDefaultSymptomCheckerState = (): SymptomCheckerState => ({
  chat: null,
  history: [],
  isLoading: false,
  suggestedReplies: [],
});

const createDefaultProfileData = (): ProfileData => ({
  plan: null,
  isPlanLoading: false,
  planError: null,
  symptomCheckerState: getDefaultSymptomCheckerState(),
  habits: INITIAL_HABITS,
  habitHistory: {},
});

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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => StorageService.getTheme());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    StorageService.setTheme(theme);
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
    const initializeAuth = async () => {
      const currentUserId = StorageService.getCurrentUserId();
      
      if (!currentUserId) {
        setIsLoading(false);
        return;
      }

      if (currentUserId === 'guest') {
        setCurrentUser(GUEST_PROFILE);
      } else {
        const usersDB = StorageService.getUsersDB();
        const user = usersDB[currentUserId];
        
        if (user) {
          if (!user.salivaPH || !user.geneticRisk) {
            setCurrentUser(user);
            setIsOnboarding(true);
          } else {
            setCurrentUser(user);
          }
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleGuestLogin = useCallback(() => {
    setIsLoading(true);
    setCurrentUser(GUEST_PROFILE);
    StorageService.setCurrentUserId(GUEST_PROFILE.id);
    setIsOnboarding(false);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleGoogleLogin = useCallback((response: GoogleCredentialResponse) => {
    setIsLoading(true);

    if (!response.credential) {
      console.error("Google login failed: No credential returned.");
      setIsLoading(false);
      return;
    }

    // Decode the JWT to get user info (Note: in a real app, you'd verify this on a server)
    const jwtPayload = JSON.parse(atob(response.credential.split('.')[1]));
    const { sub: googleId, name, email, picture: avatarUrl } = jwtPayload;

    const usersDB = StorageService.getUsersDB();
    const existingUser = Object.values(usersDB).find(
      u => u.authProviderId === googleId
    );

    if (existingUser) {
      setCurrentUser(existingUser);
      StorageService.setCurrentUserId(existingUser.id);
      setIsOnboarding(false);
    } else {
      const partialNewUser: UserProfile = {
        id: `user-${Date.now()}`,
        authProviderId: googleId,
        name: name,
        email: email,
        avatarUrl: avatarUrl,
        joinDate: new Date().getFullYear().toString(),
        salivaPH: 0,
        geneticRisk: 'Low',
        bruxism: 'None',
        lifestyle: 'New user, just getting started!',
        goals: [],
        bio: 'Exploring oral biohacking.',
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
      setCurrentUser(partialNewUser);
      setIsOnboarding(true);
    }

    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleEmailSignUp = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const usersDB = StorageService.getUsersDB();
    const existingUser = Object.values(usersDB).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        password: password,
        joinDate: new Date().getFullYear().toString(),
        salivaPH: 0,
        geneticRisk: 'Low',
        bruxism: 'None',
        lifestyle: 'New user, just getting started!',
        goals: [],
        avatarUrl: predefinedAvatars[4], // A generic avatar
        bio: 'Exploring oral biohacking.',
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
    
    setCurrentUser(newUser);
    setIsOnboarding(true);
    return { success: true };
}, []);

const handleEmailSignIn = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const usersDB = StorageService.getUsersDB();
    const user = Object.values(usersDB).find(u => u.email.toLowerCase() === email.toLowerCase() && !u.authProviderId);

    if (user) {
        if (user.password === password) {
            setCurrentUser(user);
            StorageService.setCurrentUserId(user.id);
            setIsOnboarding(false);
            return { success: true };
        } else {
            return { success: false, error: 'Incorrect password.' };
        }
    } else {
        return { success: false, error: 'No account found with that email, or it was created with Google Sign-In.' };
    }
}, []);


  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsOnboarding(false);
    StorageService.removeCurrentUserId();
  }, []);

  const completeOnboarding = useCallback((updatedProfileData: Partial<UserProfile>) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;

      const completeProfile: UserProfile = {
        ...prevUser,
        ...updatedProfileData,
      };

      const usersDB = StorageService.getUsersDB();
      usersDB[completeProfile.id] = completeProfile;
      StorageService.saveUsersDB(usersDB);
      StorageService.setCurrentUserId(completeProfile.id);

      setIsOnboarding(false);
      return completeProfile;
    });
  }, []);

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
  const [profilesData, setProfilesData] = useState<Record<string, ProfileData>>(() =>
    StorageService.getProfilesDataDB()
  );

  useEffect(() => {
    StorageService.saveProfilesDataDB(profilesData);
  }, [profilesData]);

  const getActiveProfileData = useCallback((): ProfileData => {
    if (!currentUser) return createDefaultProfileData();
    return profilesData[currentUser.id] ?? createDefaultProfileData();
  }, [currentUser, profilesData]);

  const updateActiveProfileData = useCallback(
    (data: Partial<ProfileData>) => {
      if (!currentUser) return;
      
      setProfilesData(prev => ({
        ...prev,
        [currentUser.id]: {
          ...getActiveProfileData(),
          ...data,
        },
      }));
    },
    [currentUser, getActiveProfileData]
  );

  return {
    activeProfileData: getActiveProfileData(),
    updateActiveProfileData,
  };
};

// ==================== MAIN APP COMPONENT ====================

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { 
    isLoading, 
    currentUser, 
    isOnboarding, 
    handleGuestLogin, 
    handleGoogleLogin, 
    handleEmailSignUp,
    handleEmailSignIn,
    logout, 
    completeOnboarding 
  } = useAuth();
  const { activeProfileData, updateActiveProfileData } = useProfileData(currentUser);
  
  const [page, setPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleGeneratePlan = useCallback(async () => {
    if (!currentUser) return;
    
    updateActiveProfileData({ isPlanLoading: true, planError: null });
    
    try {
      const generatedPlan = await generatePersonalizedPlan(currentUser);
      updateActiveProfileData({ plan: generatedPlan });
    } catch (err) {
      updateActiveProfileData({
        planError: 'Failed to generate plan. Please check your API key and try again.',
      });
      console.error('Plan generation error:', err);
    } finally {
      updateActiveProfileData({ isPlanLoading: false });
    }
  }, [currentUser, updateActiveProfileData]);

  const handleToggleHabit = useCallback(
    (habitId: string) => {
      if (!currentUser) return;

      const today = getDateString(new Date());
      const newHistory = { ...activeProfileData.habitHistory };
      const todaysCompletions = newHistory[today] ? [...newHistory[today]] : [];
      const habitIndex = todaysCompletions.indexOf(habitId);

      if (habitIndex > -1) {
        todaysCompletions.splice(habitIndex, 1);
      } else {
        todaysCompletions.push(habitId);
      }

      if (todaysCompletions.length > 0) {
        newHistory[today] = todaysCompletions;
      } else {
        delete newHistory[today];
      }

      updateActiveProfileData({ habitHistory: newHistory });
    },
    [currentUser, activeProfileData.habitHistory, updateActiveProfileData]
  );

  const handleNavigate = useCallback((newPage: Page) => {
    setPage(newPage);
    setIsSidebarOpen(false);
  }, []);

  const handleUpdateProfile = useCallback(
    (updatedProfile: UserProfile) => {
      if (!currentUser || updatedProfile.id === 'guest') return;

      const usersDB = StorageService.getUsersDB();
      usersDB[updatedProfile.id] = updatedProfile;
      StorageService.saveUsersDB(usersDB);
    },
    [currentUser]
  );

  const handleExportData = useCallback(() => {
    if (!currentUser) return;

    const userData = {
      profile: currentUser,
      data: activeProfileData,
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `oralBioAI_data_${currentUser.id}_${getDateString(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [currentUser, activeProfileData]);

  const handleDeleteAccount = useCallback(() => {
    if (!currentUser || currentUser.id === 'guest') return;

    const usersDB = StorageService.getUsersDB();
    delete usersDB[currentUser.id];
    StorageService.saveUsersDB(usersDB);

    const profilesDataDB = StorageService.getProfilesDataDB();
    delete profilesDataDB[currentUser.id];
    StorageService.saveProfilesDataDB(profilesDataDB);

    logout();
  }, [currentUser, logout]);

  const renderPage = useCallback(() => {
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
                updateActiveProfileData({ symptomCheckerState: newState });
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
    handleNavigate,
    handleToggleHabit,
    theme,
    toggleTheme,
    handleExportData,
    handleDeleteAccount,
  ]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Spinner />
      </div>
    );
  }

  // Unauthenticated state
  if (!currentUser) {
    return <Login 
        onGoogleLogin={handleGoogleLogin} 
        onGuestLogin={handleGuestLogin} 
        onEmailSignUp={handleEmailSignUp}
        onEmailSignIn={handleEmailSignIn}
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