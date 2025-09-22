import React from 'react';
import { Card } from './common/Card';

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const EducationalContent: React.FC = () => {
  return (
    <Card title="Today's Biohack Tip" icon={<LightbulbIcon />}>
      <div className="space-y-3">
        <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">Biohack Your Smile: The Power of Oil Pulling</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Oil pulling, an ancient Ayurvedic practice, involves swishing a tablespoon of oil (like coconut or sesame) in your mouth for 15-20 minutes on an empty stomach.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          <span className="text-gray-900 dark:text-gray-50">Why it works:</span> The oil's lipids help pull out fat-soluble toxins and bacteria from the oral cavity. This can reduce inflammation, combat bad breath, and may even contribute to whiter teeth by removing surface stains.
        </p>
        <a href="#" className="text-sm text-blue-500 dark:text-blue-400 hover:underline">Learn more about oral microbiome &raquo;</a>
      </div>
    </Card>
  );
};

export default EducationalContent;