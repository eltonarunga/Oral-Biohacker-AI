import React from 'react';

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


const EducationalContent: React.FC = () => {
  return (
    <div className="space-y-4">
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