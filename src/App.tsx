












import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';

// Import components
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { Sidebar } from './components/Sidebar';
import Login from './components/Login';
import OnboardingWizard from './components/OnboardingWizard';
import PersonalizedPlanComponent from './components/PersonalizedPlan';
import SymptomChecker from './components/SymptomChecker';
import EducationalContent from './components/EducationalContent';
import FindDentist from './components/FindDentist';
import SmileDesignStudio from './components/SmileDesignStudio';
import UserProfilePage from './components/UserProfilePage';
import HabitHistory from './components/HabitHistory';
import DailyDietLogComponent from './components/DietChart';
import { Spinner } from './components/common/Spinner';
import { BottomNav } from './components/BottomNav';
import Chatbot from './components/Chatbot';

// Lazy load new components
const HabitManagement = lazy(() => import('./components/HabitManagement'));
const AIAssistant = lazy(() => import('./components/AIAssistant'));


// Import types and data
import { Page, UserProfile, Habit, Goal, PersonalizedPlan, DailyDietLog, MealType, MealLogItem, GoogleCredentialResponse } from './types';
import { mockProfiles } from './data/mockProfiles';
import { generatePersonalizedPlan, analyzeDietLog } from './services/apiService';
import { getDateString } from './utils/habits';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  // FIX: Replaced constructor with state class property to resolve component typing issues.
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
          <div className="bg-input-light dark:bg-input-dark p-8 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-bold">Something went wrong</h2>
            </div>
            <p className="text-subtle-light dark:text-subtle-dark mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:opacity-90 transition"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Mock data for habits
const initialHabits: Habit[] = [
    { id: 'h1', name: 'Oil Pulling', description: 'Swish with coconut oil for 15 minutes.', time: 'Morning, before breakfast', category: 'Biohacking', icon: 'water_drop' },
    { id: 'h2', name: 'Tongue Scraping', description: 'Clean your tongue surface.', time: 'Morning, after brushing', category: 'Clinically Proven', icon: 'clear_all' },
    { id: 'h3', name: 'Floss Teeth', description: 'Clean between all teeth.', time: 'Evening, before bed', category: 'Clinically Proven', icon: 'cleaning_services' },
    { id: 'h4', name: 'Take Magnesium', description: 'Aids in muscle relaxation and sleep.', time: 'Evening, 1 hour before bed', category: 'Biohacking', icon: 'pill' },
];

export const NAV_ITEMS: { page: Page; label: string; icon: string; isAITool?: boolean }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { page: 'plan', label: 'My Plan', icon: 'assignment' },
    { page: 'symptom-checker', label: 'Symptom Checker', icon: 'medical_services' },
    { page: 'diet-log', label: 'Diet Log', icon: 'restaurant' },
    { page: 'education', label: 'Learn', icon: 'school' },
    { page: 'find-dentist', label: 'Find a Dentist', icon: 'person_search' },
    { page: 'habit-history', label: 'Habit History', icon: 'history' },
    { page: 'habit-management', label: 'Manage Habits', icon: 'checklist' },
    // AI Tools
    { page: 'ai-assistant', label: 'AI Assistant', icon: 'mic', isAITool: true },
    { page: 'smile-design-studio', label: 'Smile Studio', icon: 'auto_fix_high', isAITool: true },
];

// Optimized persistent state hook
const usePersistentState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
};

export const App: React.FC = () => {
    const [user, setUser] = usePersistentState<UserProfile | null>('userProfile', null);
    const [page, setPage] = usePersistentState<Page>('currentPage', 'dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [theme, setTheme] = usePersistentState<'light' | 'dark'>('theme', 'dark');
    
    const [habits, setHabits] = usePersistentState<Habit[]>('habits', initialHabits);
    const [habitHistory, setHabitHistory] = usePersistentState<Record<string, string[]>>('habitHistory', {});
    const [dailyDietLog, setDailyDietLog] = usePersistentState<DailyDietLog>('dailyDietLog', {});
    const [personalizedPlan, setPersonalizedPlan] = usePersistentState<PersonalizedPlan | null>('personalizedPlan', null);

    const [isPlanLoading, setIsPlanLoading] = useState(false);
    const [planError, setPlanError] = useState<string | null>(null);
    const [isDietLoading, setIsDietLoading] = useState(false);
    const [dietError, setDietError] = useState<string | null>(null);
    const [isAppLoading, setIsAppLoading] = useState(true);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);
    
    useEffect(() => {
        const timer = setTimeout(() => setIsAppLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = useCallback((selectedUser: UserProfile) => { setUser(selectedUser); setPage('dashboard'); }, [setUser, setPage]);
    const handleLogout = useCallback(() => { setUser(null); setPersonalizedPlan(null); setPage('dashboard'); }, [setUser, setPersonalizedPlan, setPage]);
    const handleGuestLogin = useCallback(() => {
        const guestProfile: UserProfile = {
            id: 'guest', name: 'Guest User', email: 'guest@example.com',
            avatarUrl: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20100%20100%27%3E%3Ccircle%20cx%3D%2750%27%20cy%3D%2750%27%20r%3D%2750%27%20fill%3D%27%23E5E7EB%27%2F%3E%3Ccircle%20cx%3D%2750%27%20cy%3D%2750%27%20r%3D%2740%27%20fill%3D%27%236B7280%27%2F%3E%3Ccircle%20cx%3D%2738%27%20cy%3D%2745%27%20r%3D%275%27%20fill%3D%27white%27%2F%3E%3Ccircle%20cx%3D%2762%27%20cy%3D%2745%27%20r%3D%275%27%20fill%3D%27white%27%2F%3E%3Cpath%20d%3D%27M%2035%2065%20L%2065%2065%27%20stroke%3D%27white%27%20stroke-width%3D%274%27%20fill%3D%27none%27%20stroke-linecap%3D%27round%27%2F%3E%3C%2Fsvg%3E',
            bio: 'Exploring the app.', joinDate: new Date().getFullYear().toString(),
            salivaPH: 7.0, geneticRisk: 'Low', bruxism: 'None', lifestyle: '', goals: [], phone: '', gender: 'Prefer not to say', 
            dateOfBirth: '2000-01-01', height: 0, weight: 0, bloodType: '', dietaryRestrictions: '', allergies: '', medications: '', doctorName: ''
        };
        setUser(guestProfile); setPage('dashboard');
    }, [setUser, setPage]);
    const handleGoogleLogin = useCallback(async (response: GoogleCredentialResponse) => { handleLogin(mockProfiles[0]); }, [handleLogin]);
    const handleEmailSignUp = useCallback(async (email: string, pass: string) => { handleLogin({ ...mockProfiles[0], id: `user-${Date.now()}`, name: 'New User', email }); }, [handleLogin]);
    const handleEmailSignIn = useCallback(async (email: string, pass: string) => { handleLogin(mockProfiles.find(p => p.email.startsWith(email.split('@')[0])) || mockProfiles[1]); }, [handleLogin]);
    const handleOnboardingComplete = useCallback((updatedData: Partial<UserProfile>) => { if (user) setUser(prev => ({ ...prev!, ...updatedData })); }, [user, setUser]);
    const handleNavigate = useCallback((newPage: Page) => { setPage(newPage); setIsSidebarOpen(false); }, [setPage]);
    const handleToggleHabit = useCallback((id: string) => {
        const today = getDateString(new Date());
        setHabitHistory(prev => {
            const newCompletions = prev[today]?.includes(id) ? prev[today].filter(hId => hId !== id) : [...(prev[today] || []), id];
            return { ...prev, [today]: newCompletions };
        });
    }, [setHabitHistory]);
    const handleAddHabit = useCallback((newHabitData: Omit<Habit, 'id'>) => setHabits(prev => [...prev, { ...newHabitData, id: `h-${Date.now()}` }]), [setHabits]);
    const handleUpdateHabit = useCallback((updatedHabit: Habit) => setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h)), [setHabits]);
    const handleDeleteHabit = useCallback((habitId: string) => setHabits(prev => prev.filter(h => h.id !== habitId)), [setHabits]);
    const handleUpdateProfile = useCallback((updatedProfile: UserProfile) => setUser(updatedProfile), [setUser]);
    const handleUpdateGoals = useCallback((goals: Goal[]) => { if (user) setUser({ ...user, goals }); }, [user, setUser]);
    const handleToggleTheme = useCallback(() => setTheme(prev => prev === 'dark' ? 'light' : 'dark'), [setTheme]);
    const handleGeneratePlan = useCallback(async () => {
        if (!user) return;
        setIsPlanLoading(true); setPlanError(null);
        try { setPersonalizedPlan(await generatePersonalizedPlan(user)); } 
        catch (err) { setPlanError(`Failed to generate plan: ${err instanceof Error ? err.message : 'Unknown error'}`); } 
        finally { setIsPlanLoading(false); }
    }, [user, setPersonalizedPlan]);
    const handleUpdateDietLog = useCallback((date: string, meal: MealType, item: MealLogItem) => {
        setDailyDietLog(prev => {
            const dayLog = prev[date] || {};
            return { ...prev, [date]: { ...dayLog, [meal]: [...(dayLog[meal] || []), item] } };
        });
    }, [setDailyDietLog]);
    const handleAnalyzeDietLog = useCallback(async (date: string) => {
        const log = dailyDietLog[date]; if (!log) return;
        setIsDietLoading(true); setDietError(null);
        try {
            const analysis = await analyzeDietLog(log);
            setDailyDietLog(prev => ({ ...prev, [date]: { ...prev[date], analysis } }));
        } catch (err) { setDietError(`Failed to analyze diet: ${err instanceof Error ? err.message : 'Unknown error'}`); } 
        finally { setIsDietLoading(false); }
    }, [dailyDietLog, setDailyDietLog]);
    
    const renderPage = useMemo(() => {
        if (!user) return null;
        switch (page) {
            case 'dashboard': return <Dashboard profile={user} onNavigate={handleNavigate} habits={habits} habitHistory={habitHistory} onToggleHabit={handleToggleHabit} />;
            case 'plan': return <PersonalizedPlanComponent plan={personalizedPlan} isLoading={isPlanLoading} onGeneratePlan={handleGeneratePlan} error={planError} />;
            case 'symptom-checker': return <SymptomChecker />;
            case 'diet-log': return <DailyDietLogComponent dailyDietLog={dailyDietLog} isLoading={isDietLoading} error={dietError} onUpdateLog={handleUpdateDietLog} onAnalyzeLog={handleAnalyzeDietLog} />;
            case 'education': return <EducationalContent />;
            case 'find-dentist': return <FindDentist />;
            case 'smile-design-studio': return <SmileDesignStudio />;
            case 'habit-history': return <HabitHistory habits={habits} habitHistory={habitHistory} onNavigate={handleNavigate} />;
            case 'habit-management': return <HabitManagement habits={habits} onAddHabit={handleAddHabit} onUpdateHabit={handleUpdateHabit} onDeleteHabit={handleDeleteHabit} />;
            case 'profile': return <UserProfilePage profile={user} habits={habits} habitHistory={habitHistory} dailyDietLog={dailyDietLog} onUpdateProfile={handleUpdateProfile} onUpdateGoals={handleUpdateGoals} theme={theme} onToggleTheme={handleToggleTheme} onDeleteAccount={() => { if (window.confirm('Are you sure?')) handleLogout(); }} />;
            case 'ai-assistant': return <AIAssistant />;
            default: return <div className="text-center py-12 text-subtle-light dark:text-subtle-dark">Page not found</div>;
        }
    }, [ user, page, habits, habitHistory, dailyDietLog, personalizedPlan, isPlanLoading, planError, isDietLoading, dietError, theme, handleNavigate, handleToggleHabit, handleGeneratePlan, handleUpdateDietLog, handleAnalyzeDietLog, handleUpdateProfile, handleUpdateGoals, handleToggleTheme, handleLogout, handleAddHabit, handleUpdateHabit, handleDeleteHabit ]);

    if (isAppLoading) return <Spinner fullScreen label="Initializing..." />;
    if (!user) return <ErrorBoundary><Login onGoogleLogin={handleGoogleLogin} onGuestLogin={handleGuestLogin} onEmailSignUp={handleEmailSignUp} onEmailSignIn={handleEmailSignIn} theme={theme} /></ErrorBoundary>;
    const isOnboardingComplete = user.goals.length > 0 || user.salivaPH !== 7.0;
    if (!isOnboardingComplete && user.id !== 'guest') return <ErrorBoundary><OnboardingWizard user={user} onComplete={handleOnboardingComplete} /></ErrorBoundary>;

    return (
        <ErrorBoundary>
            <div className="flex h-screen bg-background-light dark:bg-background-dark">
                <Sidebar currentPage={page} onNavigate={handleNavigate} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} onLogout={handleLogout} />
                <div className="flex flex-1 flex-col overflow-hidden relative">
                    <Header page={page} onNavigate={handleNavigate} onToggleSidebar={() => setIsSidebarOpen(s => !s)} user={user} />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
                        <Suspense fallback={<Spinner fullScreen label="Loading..." />}>{renderPage}</Suspense>
                    </main>
                    <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                    {!isChatOpen && (
                         <button onClick={() => setIsChatOpen(true)} className="fixed bottom-20 right-4 z-30 bg-primary text-white rounded-full size-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform" aria-label="Open AI Chat">
                            <span className="material-symbols-outlined text-3xl">smart_toy</span>
                        </button>
                    )}
                </div>
                <BottomNav currentPage={page} onNavigate={handleNavigate} />
            </div>
        </ErrorBoundary>
    );
};