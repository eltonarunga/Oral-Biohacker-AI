import React from 'react';
import { PersonalizedPlan } from '../types';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';

interface PersonalizedPlanProps {
  plan: PersonalizedPlan | null;
  isLoading: boolean;
  onGeneratePlan: () => void;
  error: string | null;
}

const PlanIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
);
const SupplementIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 3a1 1 0 000 2c.552 0 1 .448 1 1v1a1 1 0 001 1h6a1 1 0 001-1V6c0-.552.448-1 1-1a1 1 0 100-2H5z" clipRule="evenodd" /><path d="M4 9a1 1 0 011-1h10a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V9z" /></svg>);
const RoutineIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" /></svg>);
const NutritionIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM4.343 5.757a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 10-2 0v1a1 1 0 102 0v-1zM4.343 14.243a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM15.657 14.243a1 1 0 001.414 1.414l.707.707a1 1 0 00-1.414-1.414l-.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5 11a1 1 0 000-2H4a1 1 0 100 2h1z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 4a1 1 0 100 2h2a1 1 0 100-2H8z" clipRule="evenodd" /></svg>);
const AlertIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.37-1.21 3.006 0l4.336 8.24c.636 1.21-.24 2.661-1.503 2.661H5.424c-1.263 0-2.139-1.451-1.503-2.661l4.336-8.24zM10 14a1 1 0 100-2 1 1 0 000 2zm0-7a1 1 0 011 1v3a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" /></svg>);

const StatusBadge: React.FC<{ status: 'Good' | 'Fair' | 'Poor' }> = ({ status }) => {
  const colorClasses = {
    Good: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    Fair: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    Poor: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[status]}`}>{status}</span>;
}

const PersonalizedPlanComponent: React.FC<PersonalizedPlanProps> = ({ plan, isLoading, onGeneratePlan, error }) => {
  return (
    <Card title="Your AI-Generated Biohacking Plan" icon={<PlanIcon />}>
      {isLoading && <Spinner />}
      {!isLoading && !plan && (
        <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Your personalized oral health plan will appear here. Update your biometrics and generate a plan tailored just for you.</p>
            <button onClick={onGeneratePlan} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg">
                Generate My Plan
            </button>
        </div>
      )}
      {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
      {plan && (
        <div className="space-y-6">
          <section>
            <div className="bg-blue-50 dark:bg-slate-700/50 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50">
                <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400 flex items-center">
                    <span className="material-symbols-outlined mr-2">psychology</span>
                    Your Plan Rationale
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{plan.planRationale}</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400 flex items-center"><AlertIcon />Key Alerts & Markers</h3>
            <ul className="space-y-2">
                {plan.alerts.map((alert, index) => (
                    <li key={index} className="bg-white dark:bg-slate-700/50 p-3 rounded-lg flex justify-between items-center border border-gray-200 dark:border-gray-600">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{alert.marker}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{alert.advice}</p>
                        </div>
                        <StatusBadge status={alert.status} />
                    </li>
                ))}
            </ul>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section>
                <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400 flex items-center"><SupplementIcon />Supplement Protocol</h3>
                <ul className="space-y-2 text-sm">
                    {plan.supplements.map((s, i) => <li key={i} className="bg-white dark:bg-slate-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600"><strong className="text-gray-900 dark:text-gray-100">{s.name}</strong> ({s.dosage}): <span className="text-gray-600 dark:text-gray-400">{s.reason}</span></li>)}
                </ul>
            </section>
            <section>
             <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400 flex items-center"><NutritionIcon />Nutritional Guidance</h3>
             <ul className="space-y-2 text-sm">
                {plan.nutrition.map((n, i) => <li key={i} className="bg-white dark:bg-slate-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600"><strong className="text-gray-900 dark:text-gray-100">{n.recommendation}</strong>: <span className="text-gray-600 dark:text-gray-400">{n.reason}</span></li>)}
            </ul>
          </section>
            <section>
                <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400 flex items-center"><RoutineIcon />Morning Routines</h3>
                 <ul className="space-y-2 text-sm">
                    {plan.morningRoutines.map((r, i) => <li key={i} className="bg-white dark:bg-slate-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600"><strong className="text-gray-900 dark:text-gray-100">{r.name}</strong> ({r.frequency}): <span className="text-gray-600 dark:text-gray-400">{r.instructions}</span></li>)}
                </ul>
            </section>
             <section>
                <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400 flex items-center"><RoutineIcon />Evening Routines</h3>
                 <ul className="space-y-2 text-sm">
                    {plan.eveningRoutines.map((r, i) => <li key={i} className="bg-white dark:bg-slate-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600"><strong className="text-gray-900 dark:text-gray-100">{r.name}</strong> ({r.frequency}): <span className="text-gray-600 dark:text-gray-400">{r.instructions}</span></li>)}
                </ul>
            </section>
          </div>
         
          <button onClick={onGeneratePlan} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
            Regenerate Plan
          </button>
        </div>
      )}
    </Card>
  );
};

export default PersonalizedPlanComponent;