import React, { useState } from 'react';
import { UserProfile, Goal } from '../types';

// ==================== CONSTANTS ====================

const TOTAL_STEPS = 5;
const PREDEFINED_GOALS = [
    "Whiten my smile",
    "Reduce gum inflammation",
    "Prevent cavities",
    "Freshen my breath",
    "Strengthen enamel"
];

// ==================== SUB-COMPONENTS ====================

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    return (
        <div className="w-full bg-white/10 rounded-full h-1.5 mb-8">
            <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
            />
        </div>
    );
};

const StepHeader: React.FC<{ icon: string; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
    <div className="text-center mb-8">
        <div className="w-16 h-16 bg-white/5 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl">{icon}</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground-dark">{title}</h2>
        <p className="text-subtle-dark mt-2">{subtitle}</p>
    </div>
);

const GoalPill: React.FC<{ goal: string; isSelected: boolean; onSelect: () => void; }> = ({ goal, isSelected, onSelect }) => {
    const baseClasses = "flex items-center gap-3 w-full text-left p-3 rounded-lg border transition-colors cursor-pointer";
    const selectedClasses = "bg-primary/20 border-primary text-foreground-dark";
    const unselectedClasses = "bg-white/5 border-white/10 hover:bg-white/10 text-subtle-dark";

    return (
        <button onClick={onSelect} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
            <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${isSelected ? 'border-primary bg-primary' : 'border-subtle-dark'}`}>
                {isSelected && <span className="material-symbols-outlined text-sm text-white">check</span>}
            </div>
            <span>{goal}</span>
        </button>
    );
};


// ==================== TYPES ====================

interface OnboardingWizardProps {
    user: UserProfile;
    onComplete: (updatedProfileData: Partial<UserProfile>) => void;
}


// ==================== MAIN COMPONENT ====================

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ user, onComplete }) => {
    const [step, setStep] = useState(1);
    const [hasConsented, setHasConsented] = useState(false);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [customGoal, setCustomGoal] = useState('');
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

    const handleGoalSelection = (goalText: string) => {
        setSelectedGoals(prev =>
            prev.includes(goalText)
                ? prev.filter(g => g !== goalText)
                : [...prev, goalText]
        );
    };

    const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const handleNextFromGoals = () => {
        const goalObjects: Goal[] = selectedGoals.map(text => ({
            id: `g-onboard-${text.replace(/\s+/g, '-').toLowerCase()}`,
            text,
            isCompleted: false
        }));

        if (customGoal.trim()) {
            goalObjects.push({
                id: `g-onboard-custom-${Date.now()}`,
                text: customGoal.trim(),
                isCompleted: false
            });
        }
        setFormData(prev => ({ ...prev, goals: goalObjects }));
        nextStep();
    };

    const handleSubmit = () => {
        onComplete(formData);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <div className="text-center">
                            <img src={user.avatarUrl} alt="Your avatar" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/10 shadow-lg" />
                            <h1 className="text-3xl font-bold text-foreground-dark mb-2">Welcome, {user.name}!</h1>
                            <p className="text-subtle-dark mb-8 max-w-sm mx-auto">Let's set up your profile to create a personalized oral health plan just for you.</p>
                            <button onClick={nextStep} className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 animate-glow">Get Started</button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <StepHeader icon="privacy_tip" title="Your Data Privacy" subtitle="Before we continue, it's important you understand how your data is handled." />
                        <div className="space-y-4 text-sm bg-white/5 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-green-400 mt-1">verified_user</span>
                                <p className="text-subtle-dark"><strong className="text-foreground-dark">Stored Locally:</strong> All personal data is stored securely on your device's local storage. It's never sent to any server.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-green-400 mt-1">lock</span>
                                <p className="text-subtle-dark"><strong className="text-foreground-dark">You're in Control:</strong> You can export or delete your data at any time from your profile page.</p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-start">
                            <input
                                id="consent-checkbox"
                                type="checkbox"
                                checked={hasConsented}
                                onChange={(e) => setHasConsented(e.target.checked)}
                                className="h-5 w-5 rounded border-subtle-dark bg-white/5 text-primary focus:ring-primary mt-0.5"
                            />
                            <label htmlFor="consent-checkbox" className="ml-3 text-sm text-subtle-dark">
                                I understand and agree to my data being stored locally on my device.
                            </label>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={prevStep} className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-lg transition duration-200">Back</button>
                            <button onClick={nextStep} disabled={!hasConsented} className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Continue</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <StepHeader icon="biotech" title="Your Core Biometrics" subtitle="This helps our AI understand your unique biological baseline." />
                        <div className="space-y-6">
                             <div>
                                <label htmlFor="salivaPH" className="text-sm font-medium text-subtle-dark block mb-2">Saliva pH</label>
                                <input id="salivaPH" type="number" name="salivaPH" value={formData.salivaPH} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-primary focus:border-primary" step="0.1"/>
                                <p className="text-xs text-subtle-dark mt-1">A healthy range is typically between 6.7 and 7.4.</p>
                            </div>
                            <div>
                                <label htmlFor="geneticRisk" className="text-sm font-medium text-subtle-dark block mb-2">Genetic Risk for Periodontitis</label>
                                <select id="geneticRisk" name="geneticRisk" value={formData.geneticRisk} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-primary focus:border-primary">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="bruxism" className="text-sm font-medium text-subtle-dark block mb-2">Bruxism (Teeth Grinding/Clenching)</label>
                                <select id="bruxism" name="bruxism" value={formData.bruxism} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-primary focus:border-primary">
                                    <option>None</option>
                                    <option>Mild</option>
                                    <option>Moderate</option>
                                    <option>Severe</option>
                                </select>
                            </div>
                        </div>
                         <div className="flex gap-4 mt-8">
                            <button onClick={prevStep} className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-lg transition duration-200">Back</button>
                            <button onClick={nextStep} className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition duration-200">Next</button>
                        </div>
                    </div>
                );
            case 4:
                 return (
                    <div>
                        <StepHeader icon="flag" title="What are your primary goals?" subtitle="Select your top ambitions. This helps tailor your plan." />
                        <div className="space-y-3">
                            {PREDEFINED_GOALS.map(goal => (
                                <GoalPill key={goal} goal={goal} isSelected={selectedGoals.includes(goal)} onSelect={() => handleGoalSelection(goal)} />
                            ))}
                            <input
                                type="text"
                                value={customGoal}
                                onChange={(e) => setCustomGoal(e.target.value)}
                                placeholder="Add a custom goal..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-subtle-dark focus:ring-primary focus:border-primary mt-2"
                            />
                        </div>
                         <div className="flex gap-4 mt-8">
                            <button onClick={prevStep} className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-lg transition duration-200">Back</button>
                            <button onClick={handleNextFromGoals} className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition duration-200">Next</button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div>
                        <StepHeader icon="rocket_launch" title="You're All Set!" subtitle="Your personalized dashboard is ready. Let's start your journey to optimal oral health." />
                        <div className="bg-white/5 p-4 rounded-lg space-y-3 text-sm">
                            <p className="text-subtle-dark">You've set up the following:</p>
                            <ul className="list-disc list-inside text-subtle-dark space-y-1">
                                <li><strong>3</strong> core biometric markers</li>
                                <li><strong>{formData.goals?.length || 0}</strong> primary health goals</li>
                            </ul>
                            <p className="text-subtle-dark pt-2">Next, you'll see your dashboard where you can track habits and generate your AI-powered plan.</p>
                        </div>
                        <button onClick={handleSubmit} className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">Go to My Dashboard</button>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="min-h-screen bg-background-dark flex flex-col justify-center items-center p-4">
            <div className="glass-card max-w-lg w-full text-left rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300">
                <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
                <div key={step}>
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;