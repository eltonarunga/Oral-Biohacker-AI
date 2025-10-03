import React, { useState, useCallback } from 'react';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import * as geminiService from '../services/geminiService';
import { EducationalContentResult } from '../types';

interface EducationalArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  link: string;
  icon: string; // Material Symbols icon name
}

const articles: EducationalArticle[] = [
  {
    id: 'fluoride',
    title: "Fluoride's Role in Cavity Prevention",
    summary: "Fluoride is a mineral that strengthens tooth enamel, making it more resistant to acid attacks from plaque bacteria and sugars in the mouth. It is a cornerstone of modern cavity prevention.",
    source: "American Dental Association (ADA)",
    link: "https://www.ada.org/resources/community-initiatives/fluoride-in-water",
    icon: "health_and_safety"
  },
  {
    id: 'flossing',
    title: "The Importance of Interdental Cleaning",
    summary: "Cleaning between your teeth daily with floss or another interdental cleaner is crucial for removing plaque and food particles where a toothbrush can't reach, preventing gum disease and cavities.",
    source: "Peer-reviewed research",
    link: "https://www.efp.org/for-patients/what-is-periodontitis/",
    icon: "cleaning_services"
  },
  {
    id: 'gum-disease',
    title: "Understanding Gum Disease (Periodontitis)",
    summary: "Gum disease is an infection of the tissues that hold your teeth in place. It's typically caused by poor brushing and flossing habits that allow plaque—a sticky film of bacteria—to build up on the teeth and harden.",
    source: "American Dental Association (ADA)",
    link: "https://www.ada.org/resources/research/science-and-research-institute/oral-health-topics/gum-disease",
    icon: "coronavirus"
  },
  {
    id: 'nutrition',
    title: "Nutrition for a Healthy Mouth",
    summary: "A balanced diet rich in vitamins and minerals is essential for oral health. Foods high in calcium, phosphorus, and vitamin C help build strong teeth and healthy gums. Limit sugary snacks and drinks.",
    source: "Academy of Nutrition and Dietetics",
    link: "https://www.eatright.org/health/wellness/oral-health",
    icon: "nutrition"
  }
];

const ArticleCard: React.FC<{ article: EducationalArticle }> = ({ article }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 size-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-lg">
            <span className="material-symbols-outlined">{article.icon}</span>
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">{article.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Source: {article.source}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{article.summary}</p>
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1">
                Read More <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
        </div>
      </div>
    </div>
  );
};

const FormattedContent: React.FC<{ text: string }> = ({ text }) => {
    // Basic markdown-like formatting for bold text and lists.
    const parseLine = (line: string) => {
        const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="text-gray-700 dark:text-gray-300 space-y-2 prose dark:prose-invert prose-sm max-w-none">
            {text.split('\n').map((line, i) => {
                if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                    return <div key={i} className="flex items-start"><span className="mr-2 mt-1">•</span><span>{parseLine(line.substring(2))}</span></div>;
                }
                if (line.trim() === '') {
                    return <div key={i} className="h-2" />;
                }
                return <p key={i}>{parseLine(line)}</p>;
            })}
        </div>
    );
};


const EducationalContent: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<EducationalContentResult | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!query.trim()) return;
        
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await geminiService.generateEducationalContent(query);
            setResult(response);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [query]);

  return (
    <div className="space-y-6">
        <Card title="Ask Our AI" icon={<span className="material-symbols-outlined text-2xl">spark</span>}>
            <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Have a question about oral health? Get an AI-generated answer based on reliable web sources.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        placeholder="e.g., What is oil pulling?"
                        disabled={isLoading}
                        className="flex-1 w-full bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                        aria-label="Ask a question about oral health"
                    />
                    <button 
                        onClick={handleGenerate} 
                        disabled={isLoading || !query.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Generate AI answer"
                    >
                        {isLoading ? <Spinner size="xs" variant="white" /> : <span className="material-symbols-outlined text-lg">auto_awesome</span>}
                        <span>Generate</span>
                    </button>
                </div>

                {isLoading && (
                    <div className="py-8 flex justify-center">
                        <Spinner label="Finding the best information..." />
                    </div>
                )}
                {error && (
                    <p className="text-red-700 dark:text-red-300 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg" role="alert">{error}</p>
                )}
                {result && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 message-enter">
                        <FormattedContent text={result.text} />
                        
                        {result.sources.length > 0 && (
                             <div className="mt-4">
                                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Sources</h4>
                                <ul className="space-y-1">
                                    {result.sources.map((source, index) => (
                                        <li key={index}>
                                            <a 
                                                href={source.web.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                            >
                                                <span>{index + 1}. {source.web.title || source.web.uri}</span>
                                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
        
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Oral Health Knowledge Base</h2>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
                Explore topics based on peer-reviewed research and guidelines from leading dental associations.
            </p>
        </div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default EducationalContent;
