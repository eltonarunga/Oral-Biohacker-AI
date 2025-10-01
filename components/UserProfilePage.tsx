

import React, { useState, useRef } from 'react';
import { UserProfile, Goal } from '../types';
import AvatarSelectionModal from './AvatarSelectionModal';

interface UserProfilePageProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onExportData: () => void;
  onDeleteAccount: () => void;
}


const GoalManager: React.FC<{ profile: UserProfile, onUpdateProfile: (profile: UserProfile) => void }> = ({ profile, onUpdateProfile }) => {
    const [newGoalText, setNewGoalText] = useState('');

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalText.trim() === '') return;
        const newGoal: Goal = {
            id: `goal-${Date.now()}-${Math.random()}`,
            text: newGoalText.trim(),
            isCompleted: false,
        };
        const updatedProfile = { ...profile, goals: [...profile.goals, newGoal] };
        onUpdateProfile(updatedProfile);
        setNewGoalText('');
    };

    const handleToggleGoal = (goalId: string) => {
        const updatedGoals = profile.goals.map(g =>
            g.id === goalId ? { ...g, isCompleted: !g.isCompleted } : g
        );
        onUpdateProfile({ ...profile, goals: updatedGoals });
    };

    const handleDeleteGoal = (goalId: string) => {
        const updatedGoals = profile.goals.filter(g => g.id !== goalId);
        onUpdateProfile({ ...profile, goals: updatedGoals });
    };
    
    const activeGoals = profile.goals.filter(g => !g.isCompleted);
    const completedGoals = profile.goals.filter(g => g.isCompleted);

    return (
        <div>
            <h3 className="text-gray-900 dark:text-gray-50 text-lg font-bold leading-tight tracking-[-0.015em] px-0 pb-3 pt-2">Health Goals</h3>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden p-4 space-y-4">
                <form onSubmit={handleAddGoal} className="flex gap-2">
                    <input
                        type="text"
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        placeholder="Add a new goal..."
                        className="flex-1 w-full bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 rounded-lg p-2 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50" disabled={!newGoalText.trim()}>
                        Add
                    </button>
                </form>

                {activeGoals.length > 0 && <div className="space-y-2">
                    <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Goals</h4>
                    {activeGoals.map(goal => (
                        <GoalItem key={goal.id} goal={goal} onToggle={handleToggleGoal} onDelete={handleDeleteGoal} />
                    ))}
                </div>}
                
                {completedGoals.length > 0 && <div className="space-y-2 pt-2">
                    <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Completed Goals</h4>
                    {completedGoals.map(goal => (
                        <GoalItem key={goal.id} goal={goal} onToggle={handleToggleGoal} onDelete={handleDeleteGoal} />
                    ))}
                </div>}

                {profile.goals.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">No goals yet. Add one to get started!</p>
                )}
            </div>
        </div>
    );
};

const GoalItem: React.FC<{ goal: Goal, onToggle: (id: string) => void, onDelete: (id: string) => void }> = ({ goal, onToggle, onDelete }) => (
    <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
        <input
            type="checkbox"
            checked={goal.isCompleted}
            onChange={() => onToggle(goal.id)}
            className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 bg-transparent text-blue-600 checked:bg-blue-600 checked:border-blue-600 focus:ring-blue-500"
            aria-labelledby={`goal-text-${goal.id}`}
        />
        <p id={`goal-text-${goal.id}`} className={`flex-1 text-gray-800 dark:text-gray-200 text-sm ${goal.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
            {goal.text}
        </p>
        <button onClick={() => onDelete(goal.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400" aria-label={`Delete goal: ${goal.text}`}>
             <span className="material-symbols-outlined text-xl">delete</span>
        </button>
    </div>
);


const UserProfilePage: React.FC<UserProfilePageProps> = ({ profile, onUpdateProfile, theme, onToggleTheme, onExportData, onDeleteAccount }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This will permanently erase all your data from this device. This action cannot be undone.")) {
            onDeleteAccount();
        }
    };

    return (
        <>
            <div className="p-4 space-y-6">
                {/* Profile Header */}
                <div className="flex w-full flex-col gap-4 items-center">
                    <div className="flex gap-4 flex-col items-center">
                        <div className="relative">
                            <img src={profile.avatarUrl} alt={`${profile.name}'s avatar`} className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 object-cover" />
                            <button onClick={handleAvatarUploadClick} className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-1.5 shadow-md hover:bg-blue-700 transition-colors" aria-label="Upload new avatar">
                                <span className="material-symbols-outlined text-base"> add_a_photo </span>
                            </button>
                            <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleFileChange} className="hidden" aria-hidden="true" />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-gray-900 dark:text-gray-50 text-2xl font-bold leading-tight tracking-[-0.015em] text-center">{profile.name}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal text-center">{profile.bio}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal text-center">Joined {profile.joinDate}</p>
                             <button onClick={() => setIsAvatarModalOpen(true)} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mt-2">
                                Choose from gallery
                            </button>
                        </div>
                    </div>
                </div>

                <GoalManager profile={profile} onUpdateProfile={onUpdateProfile} />

                {/* Personal Information */}
                <div>
                    <h3 className="text-gray-900 dark:text-gray-50 text-lg font-bold leading-tight tracking-[-0.015em] px-0 pb-3 pt-2">Personal Information</h3>
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                        <InfoRow icon="Envelope" label="Email" value={profile.email} />
                        <InfoRow icon="Phone" label="Phone" value={profile.phone} />
                        <InfoRow icon="GenderFemale" label="Gender" value={profile.gender} />
                        <InfoRow icon="Calendar" label="Date of Birth" value={profile.dateOfBirth} noBorder />
                    </div>
                </div>
                {/* Biometric Data */}
                <div>
                    <h3 className="text-gray-900 dark:text-gray-50 text-lg font-bold leading-tight tracking-[-0.015em] px-0 pb-3 pt-2">Biometric Data</h3>
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                        <InfoRow icon="Ruler" label="Height" value={`${profile.height} cm`} />
                        <InfoRow icon="Barbell" label="Weight" value={`${profile.weight} kg`} />
                        <InfoRow icon="Drop" label="Blood Type" value={profile.bloodType} noBorder />
                    </div>
                </div>
                {/* Health Details */}
                <div>
                    <h3 className="text-gray-900 dark:text-gray-50 text-lg font-bold leading-tight tracking-[-0.015em] px-0 pb-3 pt-2">Health Details</h3>
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                        <InfoRow icon="Leaf" label="Dietary Restrictions" value={profile.dietaryRestrictions} />
                        <InfoRow icon="Prohibit" label="Allergies" value={profile.allergies} />
                        <InfoRow icon="Pill" label="Medications" value={profile.medications} />
                        <InfoRow icon="Stethoscope" label="Doctor's Name" value={profile.doctorName} noBorder />
                    </div>
                </div>
                {/* App Settings */}
                <div>
                    <h3 className="text-gray-900 dark:text-gray-50 text-lg font-bold leading-tight tracking-[-0.015em] px-0 pb-3 pt-2">App Settings</h3>
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                        <ToggleRow icon="Bell" label="Notifications" enabled={notificationsEnabled} onToggle={setNotificationsEnabled} />
                        <ToggleRow icon="dark_mode" label="Dark Mode" enabled={theme === 'dark'} onToggle={onToggleTheme} isMaterialIcon />
                        <LinkRow icon="ShieldCheck" label="Privacy Settings" />
                        <LinkRow icon="FileText" label="Terms of Service" />
                        <LinkRow icon="Question" label="Help & Support" noBorder/>
                    </div>
                </div>
                {/* Data & Privacy */}
                {profile.id !== 'guest' && (
                    <div>
                        <h3 className="text-gray-900 dark:text-gray-50 text-lg font-bold leading-tight tracking-[-0.015em] px-0 pb-3 pt-2">Data & Privacy</h3>
                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden p-4 space-y-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Your data is stored only on this device. You can export a copy or delete it permanently.</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button onClick={onExportData} className="flex-1 text-center py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-xl">download</span>
                                    Export My Data
                                </button>
                                <button onClick={handleDeleteAccount} className="flex-1 text-center py-2 px-3 bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:text-red-300 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-xl">delete_forever</span>
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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

const ICONS: { [key: string]: React.ReactNode } = {
    Envelope: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"></path></svg>,
    Phone: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path></svg>,
    GenderFemale: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M208,96a80,80,0,1,0-88,79.6V200H88a8,8,0,0,0,0,16h32v24a8,8,0,0,0,16,0V216h32a8,8,0,0,0,0-16H136V175.6A80.11,80.11,0,0,0,208,96ZM64,96a64,64,0,1,1,64,64A64.07,64.07,0,0,1,64,96Z"></path></svg>,
    Calendar: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path></svg>,
    Ruler: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M235.32,73.37,182.63,20.69a16,16,0,0,0-22.63,0L20.68,160a16,16,0,0,0,0,22.63l52.69,52.68a16,16,0,0,0,22.63,0L235.32,96A16,16,0,0,0,235.32,73.37ZM84.68,224,32,171.31l32-32,26.34,26.35a8,8,0,0,0,11.32-11.32L75.31,128,96,107.31l26.34,26.35a8,8,0,0,0,11.32-11.32L107.31,96,128,75.31l26.34,26.35a8,8,0,0,0,11.32-11.32L139.31,64l32-32L224,84.69Z"></path></svg>,
    Barbell: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M248,120h-8V88a16,16,0,0,0-16-16H208V64a16,16,0,0,0-16-16H168a16,16,0,0,0-16,16v56H104V64A16,16,0,0,0,88,48H64A16,16,0,0,0,48,64v8H32A16,16,0,0,0,16,88v32H8a8,8,0,0,0,0,16h8v32a16,16,0,0,0,16,16H48v8a16,16,0,0,0,16,16H88a16,16,0,0,0,16-16V136h48v56a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16v-8h16a16,16,0,0,0,16-16V136h8a8,8,0,0,0,0-16ZM32,168V88H48v80Zm56,24H64V64H88V192Zm104,0H168V64h24V175.82c0,.06,0,.12,0,.18s0,.12,0,.18V192Zm32-24H208V88h16Z"></path></svg>,
    Drop: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M174,47.75a254.19,254.19,0,0,0-41.45-38.3,8,8,0,0,0-9.18,0A254.19,254.19,0,0,0,82,47.75C54.51,79.32,40,112.6,40,144a88,88,0,0,0,176,0C216,112.6,201.49,79.32,174,47.75ZM128,216a72.08,72.08,0,0,1-72-72c0-57.23,55.47-105,72-118,16.53,13,72,60.75,72,118A72.08,72.08,0,0,1,128,216Zm55.89-62.66a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68Z"></path></svg>,
    Bell: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path></svg>,
    ShieldCheck: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path></svg>,
    FileText: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"></path></svg>,
    Question: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>,
    Leaf: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M219,139.75,172.23,195a16,16,0,0,1-22.45,0L103,142.23a16,16,0,0,1,0-22.45l46.72-52.75A16,16,0,0,1,161,61.16l49.25,27.09a32,32,0,0,1-13,58.82ZM155,75.92l-42.2,47.7,42.19,42.2,42.2-47.7ZM152.23,211L37,98.23a16,16,0,0,1,0-22.45L96.25,16.52a16,16,0,0,1,22.45,0L216.48,124.3a8,8,0,0,1-11.31,11.31L107,35.92,53,89.77l102.25,97.7,11.3-11.3a8,8,0,0,1,11.31,11.31Z"></path></svg>,
    Prohibit: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm56-88a56,56,0,0,1-98.69-34.83,8,8,0,1,1,15.86,2.34A40,40,0,1,0,168,128a8,8,0,0,1-16,0,24,24,0,1,1-24-24,8,8,0,0,1,0-16,40,40,0,1,0-40,40,8,8,0,0,1-16,0,56,56,0,0,1,112,0Z"></path></svg>,
    Pill: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M190.54,65.46a92,92,0,0,0-129.7,0,91.31,91.31,0,0,0-19.6,28.69,92,92,0,0,0,129.7,129.7,91.31,91.31,0,0,0,19.6-28.69,92,92,0,0,0,0-129.7Zm-11.32,118.38a76,76,0,0,1-107.48-107.48,75.31,75.31,0,0,1,16.22-23.77L178.74,153.38A75.31,75.31,0,0,1,179.22,183.84ZM91.26,76.62l96.79,96.79a75.31,75.31,0,0,1-16.22,23.77A76,76,0,0,1,64.34,89.69,75.31,75.31,0,0,1,91.26,76.62ZM128,120a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h24A8,8,0,0,1,128,120Zm48,0a8,8,0,0,1-8,8H144a8,8,0,0,1,0-16h24A8,8,0,0,1,176,120Z"></path></svg>,
    Stethoscope: <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M224,96a8,8,0,0,1-8,8H200V216a8,8,0,0,1-16,0V104H72v56a24,24,0,0,0,48,0,8,8,0,0,1,16,0,40,40,0,0,1-80,0V104H40a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8ZM56,88V72H200V88Zm80-48a24,24,0,1,0-24,24A24,24,0,0,0,136,40Z"></path></svg>,
};

const InfoRow = ({ icon, label, value, noBorder = false }: { icon: string, label: string, value: string, noBorder?: boolean }) => (
    <div className={`flex items-center gap-4 px-4 py-3 ${!noBorder && 'border-b border-gray-200 dark:border-gray-700'}`}>
        <div className="flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shrink-0 size-12">{ICONS[icon]}</div>
        <div className="flex flex-col justify-center">
            <p className="text-gray-900 dark:text-gray-50 text-base font-medium leading-normal line-clamp-1">{label}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">{value}</p>
        </div>
    </div>
);
const ToggleRow = ({ icon, label, enabled, onToggle, isMaterialIcon = false }: { icon: string, label: string, enabled: boolean, onToggle: (e:boolean) => void, isMaterialIcon?: boolean }) => (
    <div className={`flex items-center gap-4 px-4 py-3 justify-between ${isMaterialIcon ? '' : 'border-b border-gray-200 dark:border-gray-700'}`}>
        <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shrink-0 size-10">
                {isMaterialIcon ? <span className="material-symbols-outlined">{icon}</span> : ICONS[icon]}
            </div>
            <p className="text-gray-900 dark:text-gray-50 text-base font-normal leading-normal flex-1 truncate">{label}</p>
        </div>
        <div className="shrink-0">
            <label className={`relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-gray-200 dark:bg-slate-700 p-0.5 transition-colors ${enabled && 'bg-blue-600 justify-end'}`}>
                <div className="h-full w-[27px] rounded-full bg-white transition-transform" style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px' }}></div>
                <input checked={enabled} onChange={e => onToggle(e.target.checked)} className="invisible absolute" type="checkbox" />
            </label>
        </div>
    </div>
);
const LinkRow = ({ icon, label, noBorder=false }: { icon: string, label: string, noBorder?: boolean }) => (
     <a className={`flex items-center gap-4 px-4 py-3 justify-between hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${!noBorder && 'border-b border-gray-200 dark:border-gray-700'}`} href="#">
        <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shrink-0 size-10">{ICONS[icon]}</div>
            <p className="text-gray-900 dark:text-gray-50 text-base font-normal leading-normal flex-1 truncate">{label}</p>
        </div>
        <div className="shrink-0 text-gray-400 dark:text-gray-500">
             <div className="flex size-7 items-center justify-center">
                <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M181.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L164.69,128,98.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,181.66,133.66Z"></path></svg>
            </div>
        </div>
    </a>
);

export default UserProfilePage;