import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingWizardProps {
  user: UserProfile;
  onComplete: (updatedProfileData: Partial<UserProfile>) => void;
}

const ProgressIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
    <div className="flex justify-center items-center gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
            <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                    index + 1 === currentStep ? 'w-8 bg-blue-500' : 'w-2 bg-slate-600'
                }`}
            />
        ))}
    </div>
);


const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ user, onComplete }) => {
    const [step, setStep] = useState(1);
    const [hasConsented, setHasConsented] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({
        salivaPH: 7.0,
        geneticRisk: 'Low',
        bruxism: 'None',
        goals: [],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['salivaPH'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) : value }));
    };

    const handleGoalChange = (index: number, text: string) => {
        const newGoals = [...(formData.goals || [])];
        if (!newGoals[index]) {
            newGoals[index] = { id: `g-onboard-${index}`, text: '', isCompleted: false };
        }
        newGoals[index].text = text;
        setFormData(prev => ({ ...prev, goals: newGoals.filter(g => g.text.trim() !== '') }));
    };
    
    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = () => {
        onComplete(formData);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="text-center">
                        <img src={user.avatarUrl} alt="Your avatar" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-700 shadow-lg" />
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user.name}!</h1>
                        <p className="text-slate-400 mb-8 max-w-sm mx-auto">Let's set up your profile to create a personalized oral health plan just for you.</p>
                        <button onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105">Get Started</button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4 text-center">Your Data Privacy</h2>
                        <p className="text-slate-400 mb-6 text-sm">
                            Before we continue, it's important you understand how your data is handled.
                        </p>
                        <div className="space-y-4 text-sm bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-green-400 mt-1">verified_user</span>
                                <p className="text-slate-300"><strong className="text-white">Stored Locally:</strong> All personal and health data you provide is stored securely on your device's local storage. It is never sent to or stored on any server.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-green-400 mt-1">lock</span>
                                <p className="text-slate-300"><strong className="text-white">You're in Control:</strong> You have full control over your data. You can export or delete it at any time from your profile page.</p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center">
                            <input
                                id="consent-checkbox"
                                type="checkbox"
                                checked={hasConsented}
                                onChange={(e) => setHasConsented(e.target.checked)}
                                className="h-5 w-5 rounded border-gray-400 bg-slate-700 text-blue-500 focus:ring-blue-500"
                            />
                            <label htmlFor="consent-checkbox" className="ml-3 text-sm text-slate-300">
                                I understand and agree to my data being stored locally on my device.
                            </label>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={prevStep} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">Back</button>
                            <button onClick={nextStep} disabled={!hasConsented} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Continue</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4 text-center">Your Core Biometrics</h2>
                        <p className="text-slate-400 mb-8 text-center">This helps our AI understand your unique biological baseline.</p>
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-slate-400 block mb-2">Saliva pH (Typical range is 6.7 - 7.4)</label>
                                <input type="number" name="salivaPH" value={formData.salivaPH} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500" step="0.1"/>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400 block mb-2">Genetic Risk for Periodontitis</label>
                                <select name="geneticRisk" value={formData.geneticRisk} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400 block mb-2">Bruxism (Teeth Grinding/Clenching)</label>
                                <select name="bruxism" value={formData.bruxism} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500">
                                    <option>None</option>
                                    <option>Mild</option>
                                    <option>Moderate</option>
                                    <option>Severe</option>
                                </select>
                            </div>
                        </div>
                         <div className="flex gap-4 mt-8">
                            <button onClick={prevStep} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">Back</button>
                            <button onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">Next</button>
                        </div>
                    </div>
                );
            case 4:
                 return (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4 text-center">What are your primary goals?</h2>
                        <p className="text-slate-400 mb-8 text-center">Select or type your top health ambitions. You can add more later.</p>
                        <div className="space-y-3">
                            {['Reduce gum inflammation', 'Whiten my smile', ''].map((placeholder, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={formData.goals?.[index]?.text || ''}
                                    onChange={(e) => handleGoalChange(index, e.target.value)}
                                    placeholder={placeholder || 'Add a custom goal...'}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                                />
                            ))}
                        </div>
                         <div className="flex gap-4 mt-8">
                            <button onClick={prevStep} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">Back</button>
                            <button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">Finish Setup</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full text-left bg-slate-800 border border-slate-700 rounded-2xl shadow-lg p-8">
                <ProgressIndicator currentStep={step} totalSteps={4} />
                {renderStep()}
            </div>
        </div>
    );
};

export default OnboardingWizard;