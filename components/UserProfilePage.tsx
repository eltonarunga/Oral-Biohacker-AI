import React, { useState, useRef } from 'react';
import { UserProfile, Goal, Habit, DailyDietLog } from '../types';
import AvatarSelectionModal from './AvatarSelectionModal';

interface UserProfilePageProps {
  profile: UserProfile;
  habits: Habit[];
  habitHistory: Record<string, string[]>;
  dailyDietLog: DailyDietLog;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateGoals: (goals: Goal[]) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onDeleteAccount: () => void;
}

const GoalManager: React.FC<{ profile: UserProfile, onUpdateGoals: (goals: Goal[]) => void }> = ({ profile, onUpdateGoals }) => {
    const [newGoalText, setNewGoalText] = useState('');

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalText.trim() === '') return;
        const newGoal: Goal = {
            id: `goal-${Date.now()}-${Math.random()}`,
            text: newGoalText.trim(),
            isCompleted: false,
        };
        const updatedGoals = [...profile.goals, newGoal];
        onUpdateGoals(updatedGoals);
        setNewGoalText('');
    };

    const handleToggleGoal = (goalId: string) => {
        const updatedGoals = profile.goals.map(g =>
            g.id === goalId ? { ...g, isCompleted: !g.isCompleted } : g
        );
        onUpdateGoals(updatedGoals);
    };

    const handleDeleteGoal = (goalId: string) => {
        const updatedGoals = profile.goals.filter(g => g.id !== goalId);
        onUpdateGoals(updatedGoals);
    };
    
    const activeGoals = profile.goals.filter(g => !g.isCompleted);
    const completedGoals = profile.goals.filter(g => g.isCompleted);

    return (
        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl shadow-sm">
            <h3 className="text-foreground-light dark:text-foreground-dark text-lg font-bold p-4 border-b border-border-light dark:border-border-dark">Health Goals</h3>
            <div className="p-4 space-y-4">
                <form onSubmit={handleAddGoal} className="flex gap-2">
                    <input
                        type="text"
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        placeholder="Add a new goal..."
                        className="flex-1 w-full bg-background-light dark:bg-background-dark border border-black/10 dark:border-white/10 rounded-lg p-2 text-foreground-light dark:text-foreground-dark focus:ring-primary focus:border-primary"
                    />
                    <button type="submit" className="bg-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50" disabled={!newGoalText.trim()}>
                        Add
                    </button>
                </form>

                {activeGoals.length > 0 && <div className="space-y-2">
                    <h4 className="text-subtle-light dark:text-subtle-dark text-sm font-medium">Active Goals</h4>
                    {activeGoals.map(goal => (
                        <GoalItem key={goal.id} goal={goal} onToggle={handleToggleGoal} onDelete={handleDeleteGoal} />
                    ))}
                </div>}
                
                {completedGoals.length > 0 && <div className="space-y-2 pt-2 border-t border-border-light dark:border-border-dark mt-4">
                    <h4 className="text-subtle-light dark:text-subtle-dark text-sm font-medium">Completed Goals</h4>
                    {completedGoals.map(goal => (
                        <GoalItem key={goal.id} goal={goal} onToggle={handleToggleGoal} onDelete={handleDeleteGoal} />
                    ))}
                </div>}

                {profile.goals.length === 0 && (
                    <p className="text-center text-subtle-light dark:text-subtle-dark text-sm py-4">No goals yet. Add one to get started!</p>
                )}
            </div>
        </div>
    );
};

const GoalItem: React.FC<{ goal: Goal, onToggle: (id: string) => void, onDelete: (id: string) => void }> = ({ goal, onToggle, onDelete }) => (
    <div className="flex items-center gap-3 bg-background-light dark:bg-background-dark p-2 rounded-lg">
        <button onClick={() => onToggle(goal.id)} className={`size-5 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0 ${goal.isCompleted ? 'bg-primary border-primary' : 'border-subtle-light dark:border-subtle-dark'}`} aria-label={`Mark goal as ${goal.isCompleted ? 'incomplete' : 'complete'}`}>
            {goal.isCompleted && <span className="material-symbols-outlined text-xs text-white">check</span>}
        </button>
        <p id={`goal-text-${goal.id}`} className={`flex-1 text-foreground-light dark:text-foreground-dark text-sm ${goal.isCompleted ? 'line-through text-subtle-light dark:text-subtle-dark' : ''}`}>
            {goal.text}
        </p>
        <button onClick={() => onDelete(goal.id)} className="text-subtle-light dark:text-subtle-dark hover:text-red-500 dark:hover:text-red-400" aria-label={`Delete goal: ${goal.text}`}>
             <span className="material-symbols-outlined text-xl">delete</span>
        </button>
    </div>
);


const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => {
    return (
        <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${isActive ? 'bg-primary text-white' : 'text-subtle-light dark:text-subtle-dark hover:bg-black/5 dark:hover:bg-white/10'}`}>
            {label}
        </button>
    )
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ profile, habits, habitHistory, dailyDietLog, onUpdateProfile, onUpdateGoals, theme, onToggleTheme, onDeleteAccount }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<'personal' | 'biometrics' | 'settings'>('personal');

    const handleAvatarUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            console.error('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
                onUpdateProfile({ ...profile, avatarUrl: e.target.result });
            }
        };
        reader.onerror = () => {
            console.error("Failed to read the image file.");
        };
        reader.readAsDataURL(file);
    };

    const handleAvatarSelect = (url: string) => {
        onUpdateProfile({ ...profile, avatarUrl: url });
        setIsAvatarModalOpen(false);
    };

    const handleExportData = () => {
        const dataToExport = {
            profile,
            habits,
            habitHistory,
            dailyDietLog,
        };
        try {
            const jsonString = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const dateStamp = new Date().toISOString().split('T')[0];
            link.download = `oralbio-ai-data-${profile.id}-${dateStamp}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export data:", error);
            alert("An error occurred while trying to export your data.");
        }
    };
    
    const handleDeleteAccountConfirmed = () => {
        if (window.confirm("Are you sure you want to delete your account? This will permanently erase all your data. This action cannot be undone.")) {
            onDeleteAccount();
        }
    };

    return (
        <>
            <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative flex-shrink-0">
                        <button onClick={handleAvatarUploadClick} className="group rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary" aria-label="Change profile photo">
                            <img src={profile.avatarUrl} alt={`${profile.name}'s avatar`} className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-28 object-cover transition-opacity group-hover:opacity-70" />
                            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                            </div>
                        </button>
                        <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleFileChange} className="hidden" aria-hidden="true" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-foreground-light dark:text-foreground-dark text-2xl font-bold">{profile.name}</h2>
                        <p className="text-subtle-light dark:text-subtle-dark text-base">{profile.bio}</p>
                        <p className="text-subtle-light dark:text-subtle-dark text-sm mt-1">Joined {profile.joinDate}</p>
                        <button onClick={() => setIsAvatarModalOpen(true)} className="text-sm font-medium text-primary hover:opacity-80 mt-2">
                            Choose from gallery
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-1">
                        <GoalManager profile={profile} onUpdateGoals={onUpdateGoals} />
                    </div>

                    {/* Right Column with Tabs */}
                    <div className="lg:col-span-2">
                        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl shadow-sm">
                           <div className="p-2 border-b border-border-light dark:border-border-dark">
                               <nav className="flex space-x-2">
                                   <TabButton label="Personal" isActive={activeTab === 'personal'} onClick={() => setActiveTab('personal')} />
                                   <TabButton label="Biometrics" isActive={activeTab === 'biometrics'} onClick={() => setActiveTab('biometrics')} />
                                   <TabButton label="Settings" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                               </nav>
                           </div>
                           <div className="p-4">
                               {activeTab === 'personal' && (
                                   <div className="space-y-4">
                                       <InfoRow icon="mail" label="Email" value={profile.email} />
                                       <InfoRow icon="phone" label="Phone" value={profile.phone} />
                                       <InfoRow icon="transgender" label="Gender" value={profile.gender} />
                                       <InfoRow icon="cake" label="Date of Birth" value={profile.dateOfBirth} />
                                   </div>
                               )}
                                {activeTab === 'biometrics' && (
                                   <div className="space-y-4">
                                       <InfoRow icon="height" label="Height" value={`${profile.height} cm`} />
                                       <InfoRow icon="scale" label="Weight" value={`${profile.weight} kg`} />
                                       <InfoRow icon="bloodtype" label="Blood Type" value={profile.bloodType} />
                                       <InfoRow icon="vaccines" label="Allergies" value={profile.allergies} />
                                       <InfoRow icon="no_food" label="Dietary Restrictions" value={profile.dietaryRestrictions} />
                                       <InfoRow icon="medication" label="Medications" value={profile.medications} />
                                       <InfoRow icon="stethoscope" label="Doctor's Name" value={profile.doctorName} />
                                   </div>
                               )}
                               {activeTab === 'settings' && (
                                    <div className="space-y-2">
                                        <ToggleRow icon="notifications" label="Notifications" enabled={notificationsEnabled} onToggle={setNotificationsEnabled} />
                                        <ToggleRow icon="dark_mode" label="Dark Mode" enabled={theme === 'dark'} onToggle={onToggleTheme} />
                                        <LinkRow icon="privacy_tip" label="Privacy Settings" />
                                        <LinkRow icon="description" label="Terms of Service" />
                                        <LinkRow icon="help" label="Help & Support" />
                                        {profile.id !== 'guest' && (
                                            <div className="pt-4 mt-2 border-t border-border-light dark:border-border-dark">
                                                 <p className="text-sm text-subtle-light dark:text-subtle-dark mb-3">Manage your account data. This action cannot be undone.</p>
                                                 <div className="flex flex-col sm:flex-row gap-3">
                                                    <button onClick={handleExportData} className="flex-1 text-center py-2 px-3 bg-black/5 hover:bg-black/10 text-foreground-light dark:bg-white/5 dark:hover:bg-white/10 dark:text-foreground-dark font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                                                        <span className="material-symbols-outlined text-xl">download</span>
                                                        Export My Data
                                                    </button>
                                                    <button onClick={handleDeleteAccountConfirmed} className="flex-1 text-center py-2 px-3 bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:text-red-300 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                                                        <span className="material-symbols-outlined text-xl">delete_forever</span>
                                                        Delete Account
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                               )}
                           </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <AvatarSelectionModal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                onSelectAvatar={handleAvatarSelect}
            />
        </>
    );
};


// --- Sub-components for UserProfilePage ---

const InfoRow = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
    <div className="flex items-start gap-4">
        <span className="material-symbols-outlined text-primary mt-1">{icon}</span>
        <div>
            <p className="text-subtle-light dark:text-subtle-dark text-xs font-medium uppercase tracking-wider">{label}</p>
            <p className="text-foreground-light dark:text-foreground-dark text-base font-medium">{value || 'N/A'}</p>
        </div>
    </div>
);
const ToggleRow = ({ icon, label, enabled, onToggle }: { icon: string, label: string, enabled: boolean, onToggle: (e:boolean) => void }) => (
    <div className="flex items-center justify-between p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg">
        <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-subtle-light dark:text-subtle-dark">{icon}</span>
            <p className="text-foreground-light dark:text-foreground-dark text-base font-normal">{label}</p>
        </div>
        <label className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full p-1 transition-colors ${enabled ? 'bg-primary' : 'bg-subtle-light/50 dark:bg-subtle-dark/50'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`}/>
            <input checked={enabled} onChange={e => onToggle(e.target.checked)} className="sr-only" type="checkbox" />
        </label>
    </div>
);
const LinkRow = ({ icon, label }: { icon: string, label: string }) => (
     <a className="flex items-center justify-between p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg" href="#">
        <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-subtle-light dark:text-subtle-dark">{icon}</span>
            <p className="text-foreground-light dark:text-foreground-dark text-base font-normal">{label}</p>
        </div>
        <span className="material-symbols-outlined text-subtle-light dark:text-subtle-dark">chevron_right</span>
    </a>
);

export default UserProfilePage;