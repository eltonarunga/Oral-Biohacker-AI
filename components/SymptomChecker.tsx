import React, { useState, useCallback, useMemo } from 'react';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { analyzeSymptoms } from '../services/apiService';
import { SymptomCheckResult } from '../types';
import { TTSButton } from './common/TTSButton';

const SymptomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const TriageBadge: React.FC<{ level: SymptomCheckResult['triageLevel'] }> = ({ level }) => {
    const styles = {
        'Self-Care': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
        'See a Dentist Soon': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
        'Urgent Dental Care Recommended': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    };
    const icon = {
        'Self-Care': 'healing',
        'See a Dentist Soon': 'event_available',
        'Urgent Dental Care Recommended': 'emergency',
    };
    return (
        <div className={`px-3 py-2 text-sm font-semibold rounded-full inline-flex items-center gap-2 ${styles[level]}`}>
            <span className="material-symbols-outlined text-base">{icon[level]}</span>
            {level}
        </div>
    );
};

const SymptomChecker: React.FC = () => {
    const [symptoms, setSymptoms] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SymptomCheckResult | null>(null);

    const handleAnalyze = useCallback(async () => {
        if (!symptoms.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await analyzeSymptoms(symptoms);
            setResult(response);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to analyze symptoms. ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [symptoms]);

    const textToSpeak = useMemo(() => {
        if (!result) return "";
        return `
            Triage level: ${result.triageLevel}.
            Possible conditions include: ${result.possibleConditions.map(c => c.name).join(', ')}.
            Recommendations: ${result.careRecommendations.join(' ')}.
            Disclaimer: ${result.disclaimer}.
        `;
    }, [result]);

    return (
        <div className="space-y-6">
            <Card title="AI Symptom Checker" icon={<SymptomIcon />}>
                <div className="space-y-4">
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">
                        Describe your oral health symptoms below. Our AI will provide a preliminary analysis and care recommendations.
                        <strong className="block mt-1">This is not a substitute for professional medical advice.</strong>
                    </p>
                    <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="e.g., 'My back molar is sensitive to cold drinks, and my gums bleed when I floss that area.'"
                        disabled={isLoading}
                        rows={4}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-3 text-sm text-foreground-light dark:text-foreground-dark focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 placeholder-subtle-light dark:placeholder-subtle-dark"
                        aria-label="Enter your oral health symptoms"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !symptoms.trim()}
                        className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Spinner size="xs" variant="white" /> : <span className="material-symbols-outlined">psychology</span>}
                        <span>Analyze Symptoms</span>
                    </button>
                </div>
            </Card>

            {isLoading && (
                <div className="py-8 flex justify-center">
                    <Spinner label="Analyzing your symptoms..." />
                </div>
            )}
            {error && (
                <p className="text-red-700 dark:text-red-300 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>
            )}
            {result && (
                <Card 
                  title="Analysis Result"
                  headerAction={<TTSButton textToSpeak={textToSpeak} className="text-primary hover:bg-primary/10" />}
                >
                    <div className="space-y-6">
                        <div className="text-center">
                            <TriageBadge level={result.triageLevel} />
                        </div>
                        
                        <section>
                            <h3 className="text-lg font-semibold mb-2 text-primary">Possible Conditions</h3>
                             <ul className="space-y-2">
                                {result.possibleConditions.map((cond, i) => (
                                    <li key={i} className="bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-black/10 dark:border-white/10 flex justify-between items-center">
                                        <span className="font-semibold text-foreground-light dark:text-foreground-dark">{cond.name}</span>
                                        <span className="text-sm text-subtle-light dark:text-subtle-dark">Likelihood: {cond.likelihood}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                        
                        <section>
                            <h3 className="text-lg font-semibold mb-2 text-primary">Care Recommendations</h3>
                             <ul className="space-y-2 list-disc list-inside text-foreground-light dark:text-foreground-dark">
                                {result.careRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </section>
                        
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <p className="text-sm text-yellow-800 dark:text-yellow-300 font-semibold">Disclaimer</p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-400">{result.disclaimer}</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SymptomChecker;