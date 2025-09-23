import React, { useState, useEffect } from 'react';
import { UserProfile, Goal } from '../types';
import { Card } from './common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ProfileCardProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);

const phData = [
  { name: 'Mon', pH: 7.1 },
  { name: 'Tue', pH: 7.3 },
  { name: 'Wed', pH: 7.0 },
  { name: 'Thu', pH: 7.4 },
  { name: 'Fri', pH: 7.2 },
  { name: 'Sat', pH: 7.5 },
  { name: 'Sun', pH: 7.3 },
];

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableProfile, setEditableProfile] = useState<UserProfile>(profile);

    useEffect(() => {
        setEditableProfile(profile);
    }, [profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'goals') {
            const goalTexts = value.split('\n');
            const newGoals: Goal[] = goalTexts.map((text, index) => ({
                id: editableProfile.goals[index]?.id || `goal-${Date.now()}-${index}`,
                text,
                isCompleted: editableProfile.goals[index]?.isCompleted || false,
            })).filter(goal => goal.text.trim() !== '');
            setEditableProfile(prev => ({ ...prev, goals: newGoals }));
        } else {
            const numericFields = ['salivaPH', 'height', 'weight'];
            const isNumeric = numericFields.includes(name);
            setEditableProfile(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
        }
    };
    
    const handleSave = () => {
        onSave(editableProfile);
        setIsEditing(false);
    };

    return (
        <Card title={`${profile.name}'s Biometrics`} icon={<UserIcon />}>
            {!isEditing ? (
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-400">Saliva pH</label>
                        <p className="text-lg font-semibold text-cyan-300">{profile.salivaPH.toFixed(1)}</p>
                    </div>
                     <div className="h-40 -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={phData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} fontSize={12} />
                                <YAxis domain={[6, 8]} tick={{ fill: '#9ca3af' }} fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                <Bar dataKey="pH" fill="#22d3ee" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400">Genetic Risk (Periodontitis)</label>
                        <p className="text-lg font-semibold text-white">{profile.geneticRisk}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400">Bruxism (Clenching/Grinding)</label>
                        <p className="text-lg font-semibold text-white">{profile.bruxism}</p>
                    </div>
                    
                    <h3 className="text-md font-semibold text-slate-300 !mt-6 border-t border-slate-700 pt-4">Personal Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-400">Gender</label>
                            <p className="text-md font-semibold text-white">{profile.gender}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Date of Birth</label>
                            <p className="text-md font-semibold text-white">{profile.dateOfBirth}</p>
                        </div>
                    </div>

                    <h3 className="text-md font-semibold text-slate-300 !mt-6 border-t border-slate-700 pt-4">Biometrics</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-400">Height</label>
                            <p className="text-md font-semibold text-white">{profile.height} cm</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Weight</label>
                            <p className="text-md font-semibold text-white">{profile.weight} kg</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Blood Type</label>
                            <p className="text-md font-semibold text-white">{profile.bloodType}</p>
                        </div>
                    </div>
                    
                    <h3 className="text-md font-semibold text-slate-300 !mt-6 border-t border-slate-700 pt-4">Health Information</h3>
                     <div>
                        <label className="text-sm font-medium text-slate-400">Allergies</label>
                        <p className="text-sm text-gray-300">{profile.allergies}</p>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-400">Dietary Restrictions</label>
                        <p className="text-sm text-gray-300">{profile.dietaryRestrictions}</p>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-400">Current Medications</label>
                        <p className="text-sm text-gray-300">{profile.medications}</p>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-400">Doctor's Name</label>
                        <p className="text-sm text-gray-300">{profile.doctorName}</p>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-400">Lifestyle Notes</label>
                        <p className="text-sm text-gray-300">{profile.lifestyle}</p>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-400">Health Goals</label>
                        <p className="text-sm text-gray-300">{profile.goals.map(g => g.text).join(', ')}</p>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="w-full !mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">Edit Profile</button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-400 block mb-1">Name</label>
                        <input type="text" name="name" value={editableProfile.name} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400 block mb-1">Saliva pH</label>
                        <input type="number" name="salivaPH" value={editableProfile.salivaPH} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" step="0.1"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400 block mb-1">Genetic Risk</label>
                        <select name="geneticRisk" value={editableProfile.geneticRisk} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400 block mb-1">Bruxism</label>
                        <select name="bruxism" value={editableProfile.bruxism} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                            <option>None</option>
                            <option>Mild</option>
                            <option>Moderate</option>
                            <option>Severe</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400 block mb-1">Gender</label>
                        <select name="gender" value={editableProfile.gender} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400 block mb-1">Date of Birth</label>
                        <input type="date" name="dateOfBirth" value={editableProfile.dateOfBirth} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-400 block mb-1">Height (cm)</label>
                            <input type="number" name="height" value={editableProfile.height} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400 block mb-1">Weight (kg)</label>
                            <input type="number" name="weight" value={editableProfile.weight} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400 block mb-1">Blood Type</label>
                            <input type="text" name="bloodType" value={editableProfile.bloodType} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400 block mb-1">Allergies</label>
                        <textarea name="allergies" value={editableProfile.allergies} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" rows={2}></textarea>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400 block mb-1">Dietary Restrictions</label>
                        <textarea name="dietaryRestrictions" value={editableProfile.dietaryRestrictions} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" rows={2}></textarea>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400 block mb-1">Current Medications</label>
                        <textarea name="medications" value={editableProfile.medications} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" rows={2}></textarea>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-400 block mb-1">Doctor's Name</label>
                        <input type="text" name="doctorName" value={editableProfile.doctorName} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400 block mb-1">Lifestyle Notes</label>
                        <textarea name="lifestyle" value={editableProfile.lifestyle} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" rows={3}></textarea>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-400 block mb-1">Health Goals</label>
                        <textarea name="goals" value={editableProfile.goals.map(g => g.text).join('\n')} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" rows={3}></textarea>
                    </div>
                    <button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">Save Changes</button>
                    <button onClick={() => setIsEditing(false)} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">Cancel</button>
                </div>
            )}
        </Card>
    );
};

export default ProfileCard;
