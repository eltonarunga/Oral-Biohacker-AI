import React, { useMemo } from 'react';
import { UserProfile, Goal } from '../types';

interface PersonalizedInsightsProps {
    profile: UserProfile;
    habitHistory: Record<string, string[]>;
}

interface Insight {
    icon: string;
    title: string;
    description: string;
    color: 'blue' | 'yellow' | 'red';
}

const generateInsights = (profile: UserProfile, habitHistory: Record<string, string[]>): Insight[] => {
    const insights: Insight[] = [];

    // Insight 1: Saliva pH
    if (profile.salivaPH < 7.0) {
        insights.push({
            icon: 'science',
            title: 'Slightly Acidic Environment',
            description: `Your saliva pH of ${profile.salivaPH} can increase cavity risk. Focus on alkalizing habits like Oil Pulling.`,
            color: 'yellow',
        });
    }

    // Insight 2: Genetic Risk
    if (profile.geneticRisk === 'High' || profile.geneticRisk === 'Medium') {
         insights.push({
            icon: 'biotech',
            title: 'Elevated Genetic Risk',
            description: `With a ${profile.geneticRisk.toLowerCase()} genetic risk for periodontitis, consistent flossing is crucial. Let's make it a daily priority!`,
            color: 'red',
        });
    }

    // Insight 3: Bruxism
    if (profile.bruxism !== 'None') {
        insights.push({
            icon: 'sentiment_stressed',
            title: 'Manage Jaw Tension',
            description: `Your profile indicates ${profile.bruxism.toLowerCase()} bruxism. Consider evening habits like Magnesium to promote muscle relaxation.`,
            color: 'yellow',
        });
    }

    // Insight 4: User Goals - Inflammation
    // FIX: Check the text of each goal in the array, not the array itself.
    if (profile.goals.some(g => g.text.toLowerCase().includes('inflammation'))) {
        insights.push({
            icon: 'local_fire_department',
            title: 'Focus on Anti-Inflammation',
            description: `Your goal is to reduce inflammation. Prioritize your anti-inflammatory habits and nutrition advice from your personalized plan.`,
            color: 'blue',
        });
    } 
    
    // Insight 5: User Goals - Whiter teeth
    // FIX: Check the text of each goal in the array, not the array itself.
    else if (profile.goals.some(g => g.text.toLowerCase().includes('whiten') || g.text.toLowerCase().includes('smile'))) {
        insights.push({
            icon: 'auto_awesome',
            title: 'Achieve Your Smile Goal',
            description: `To achieve your goal of a brighter smile, stay consistent with routines that manage surface stains, like Oil Pulling.`,
            color: 'blue'
        });
    }
    
    // Insight 6: Positive Reinforcement for pH
    if (profile.salivaPH >= 7.4) {
        insights.push({
            icon: 'health_and_safety',
            title: 'Optimal Alkalinity',
            description: `Great job! Your saliva pH of ${profile.salivaPH} is in an optimal, alkaline range, which helps protect your enamel.`,
            color: 'blue',
        });
    }

    // Return a limited number of insights to avoid overwhelming the user.
    return insights.slice(0, 3);
}

const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
    const colorClasses = {
        blue: {
            container: 'bg-primary/10 border-primary',
            icon: 'text-primary',
            title: 'text-foreground-light dark:text-foreground-dark',
            description: 'text-subtle-light dark:text-subtle-dark',
        },
        yellow: {
            container: 'bg-yellow-500/10 border-yellow-500',
            icon: 'text-yellow-600 dark:text-yellow-400',
            title: 'text-foreground-light dark:text-foreground-dark',
            description: 'text-subtle-light dark:text-subtle-dark',
        },
        red: {
            container: 'bg-red-500/10 border-red-500',
            icon: 'text-red-600 dark:text-red-400',
            title: 'text-foreground-light dark:text-foreground-dark',
            description: 'text-subtle-light dark:text-subtle-dark',
        },
    };
    const theme = colorClasses[insight.color];

    return (
        <div className={`p-4 rounded-xl flex items-start gap-4 border-l-4 ${theme.container}`}>
            <div className={`flex-shrink-0 mt-0.5 ${theme.icon}`}>
                <span className="material-symbols-outlined">{insight.icon}</span>
            </div>
            <div>
                <h4 className={`font-bold text-sm ${theme.title}`}>{insight.title}</h4>
                <p className={`text-sm ${theme.description}`}>{insight.description}</p>
            </div>
        </div>
    );
};


const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({ profile, habitHistory }) => {
    const insights = useMemo(() => generateInsights(profile, habitHistory), [profile, habitHistory]);

    if (insights.length === 0) {
        return null;
    }

    return (
        <div>
            <h2 className="text-foreground-light dark:text-foreground-dark text-xl font-bold mb-3">AI-Powered Insights</h2>
            <div className="space-y-3">
                {insights.map((insight, index) => (
                    <InsightCard key={index} insight={insight} />
                ))}
            </div>
        </div>
    );
};

export default PersonalizedInsights;