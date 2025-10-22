import React from 'react';
import { PersonalizedPlan } from '../types';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { NoPlanIllustration } from './common/illustrations/NoPlanIllustration';
import { TTSButton } from './common/TTSButton';

interface PersonalizedPlanProps {
  plan: PersonalizedPlan | null;
  isLoading: boolean;
  onGeneratePlan: () => void;
  error: string | null;
}

const getStatusStyles = (status: 'Good' | 'Fair' | 'Poor') => {
  switch (status) {
    case 'Good': return 'bg-green-500/10 text-green-500';
    case 'Fair': return 'bg-yellow-500/10 text-yellow-500';
    case 'Poor': return 'bg-red-500/10 text-red-500';
    default: return 'bg-gray-500/10 text-gray-500';
  }
};

const Section: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
    <section>
        <h3 className="text-lg font-semibold mb-3 text-foreground-light dark:text-foreground-dark flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
            {title}
        </h3>
        <div className="space-y-2">{children}</div>
    </section>
);

const ListItem: React.FC<{ title: string; subtitle: string; }> = ({ title, subtitle }) => (
     <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg text-sm">
        <strong className="text-foreground-light dark:text-foreground-dark">{title}</strong>: <span className="text-subtle-light dark:text-subtle-dark">{subtitle}</span>
    </div>
);


const PersonalizedPlanComponent: React.FC<PersonalizedPlanProps> = ({ plan, isLoading, onGeneratePlan, error }) => {
  if (isLoading) {
      return <div className="min-h-[300px] flex items-center justify-center"><Spinner label="Generating your plan..." /></div>;
  }
  
  if (!plan && !error) {
    return (
        <Card>
            <div className="text-center py-8">
                <NoPlanIllustration className="w-40 h-40 mx-auto text-primary" />
                <h3 className="mt-4 text-lg font-bold text-foreground-light dark:text-foreground-dark">Your Plan Awaits</h3>
                <p className="text-subtle-light dark:text-subtle-dark mt-2 mb-6 max-w-sm mx-auto">Update your biometrics and generate a plan tailored just for you.</p>
                <button onClick={onGeneratePlan} className="bg-primary hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 animate-glow flex items-center justify-center gap-2 mx-auto">
                    <span className="material-symbols-outlined">auto_awesome</span>
                    Generate My Plan
                </button>
            </div>
        </Card>
    );
  }

  if (error) {
      return <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
  }

  return (
    <div className="space-y-6">
      {plan && (
        <>
          <Card>
            <div className="bg-primary/10 p-4 rounded-xl">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold mb-2 text-primary flex items-center">
                        <span className="material-symbols-outlined mr-2">psychology</span>
                        Your Plan Rationale
                    </h3>
                    <TTSButton textToSpeak={plan.planRationale} className="text-primary hover:bg-primary/20" />
                </div>
                <p className="text-sm text-foreground-light dark:text-foreground-dark">{plan.planRationale}</p>
            </div>
          </Card>

          <Card title="Key Alerts & Markers" icon={<span className="material-symbols-outlined">flag</span>}>
            <div className="space-y-2">
                {plan.alerts.map((alert, index) => (
                    <div key={index} className="bg-black/5 dark:bg-white/5 p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-foreground-light dark:text-foreground-dark">{alert.marker}</p>
                            <p className="text-sm text-subtle-light dark:text-subtle-dark">{alert.advice}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(alert.status)}`}>{alert.status}</span>
                    </div>
                ))}
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Supplement Protocol" icon={<span className="material-symbols-outlined">pill</span>}>
                 <div className="space-y-2">
                    {plan.supplements.map((s, i) => <ListItem key={i} title={`${s.name} (${s.dosage})`} subtitle={s.reason} />)}
                </div>
            </Card>
            <Card title="Nutritional Guidance" icon={<span className="material-symbols-outlined">nutrition</span>}>
                 <div className="space-y-2">
                    {plan.nutrition.map((n, i) => <ListItem key={i} title={n.recommendation} subtitle={n.reason} />)}
                </div>
          </Card>
            <Card title="Morning Routines" icon={<span className="material-symbols-outlined">light_mode</span>}>
                <div className="space-y-2">
                    {plan.morningRoutines.map((r, i) => <ListItem key={i} title={`${r.name} (${r.frequency})`} subtitle={r.instructions} />)}
                </div>
            </Card>
             <Card title="Evening Routines" icon={<span className="material-symbols-outlined">dark_mode</span>}>
                 <div className="space-y-2">
                    {plan.eveningRoutines.map((r, i) => <ListItem key={i} title={`${r.name} (${r.frequency})`} subtitle={r.instructions} />)}
                </div>
            </Card>
          </div>
         
          <button onClick={onGeneratePlan} className="w-full mt-4 bg-primary/20 hover:bg-primary/30 text-primary font-bold py-2 px-4 rounded-lg transition duration-200">
            Regenerate Plan
          </button>
        </>
      )}
    </div>
  );
};

export default PersonalizedPlanComponent;