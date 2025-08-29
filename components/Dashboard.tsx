import React from 'react';
import { UserProfile, ProfileData } from '../types';
import ProfileCard from './ProfileCard';
import HabitTracker from './HabitTracker';

interface DashboardProps {
  profile: UserProfile;
  profileData: ProfileData;
  onUpdateProfileData: (data: Partial<ProfileData>) => void;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, profileData, onUpdateProfileData, onSaveProfile }) => {
  
  const handleLogHabit = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    onUpdateProfileData({
      habitStreak: profileData.habitStreak + 1,
      lastLoggedDate: todayStr
    });
  };

  const isHabitLoggedToday = () => {
    if (!profileData.lastLoggedDate) return false;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return profileData.lastLoggedDate === todayStr;
  };
  
  // Logic to reset streak if a day is missed
  React.useEffect(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (profileData.lastLoggedDate && profileData.lastLoggedDate !== yesterdayStr && !isHabitLoggedToday()) {
      onUpdateProfileData({ habitStreak: 0 });
    }
  }, [profile.id]); // Rerun this check when the profile changes

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Welcome, {profile.name}
        </h1>
        <p className="mt-2 text-lg text-slate-400">This is your personalized oral health dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="md:col-span-1 lg:col-span-1">
           <ProfileCard profile={profile} onSave={onSaveProfile} />
        </div>
        <div className="md:col-span-1 lg:col-span-2">
           <HabitTracker 
              streak={profileData.habitStreak} 
              isLoggedToday={isHabitLoggedToday()}
              onLogHabit={handleLogHabit}
           />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
