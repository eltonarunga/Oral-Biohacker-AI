import React, { useState } from 'react';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { findDentistsNearMe, DentistSearchResult } from '../services/geminiService';
import { Dentist, GroundingChunk } from '../types';

const DentistIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l-3.5-4.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l3.5-4.5" />
  </svg>
);

const FindDentist: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DentistSearchResult | null>(null);

    const handleFindDentists = () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const searchResult = await findDentistsNearMe(latitude, longitude);
                    setResult(searchResult);
                } catch (err) {
                    setError("Could not find dentists. The AI service may be temporarily unavailable.");
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            },
            () => {
                setError("Unable to retrieve your location. Please enable location permissions in your browser settings and try again.");
                setIsLoading(false);
            }
        );
    };

    return (
        <Card title="Find a Dentist Near You" icon={<DentistIcon />}>
            <div className="space-y-6">
                {!result && !isLoading && (
                     <div className="text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Use your current location to find nearby dental professionals recommended by our AI.</p>
                        <button 
                            onClick={handleFindDentists} 
                            disabled={isLoading}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           Use My Current Location
                        </button>
                    </div>
                )}
               
                {isLoading && <Spinner />}
                
                {error && <p className="text-red-700 dark:text-red-300 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>}
                
                {result && (
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">Here are some dentists found near you:</h3>
                        <ul className="space-y-4">
                            {result.dentists.map((dentist, index) => (
                                <li key={index} className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 p-4 rounded-lg">
                                    <h4 className="font-bold text-gray-900 dark:text-gray-50 text-md">{dentist.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{dentist.address}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{dentist.phone}</p>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dentist.address)}`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-2 inline-block"
                                    >
                                        View on Map &raquo;
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {result.sources.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-md font-semibold text-gray-500 dark:text-gray-400 mb-2">Sources:</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {result.sources.map((source, index) => (
                                        <li key={index}>
                                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                                {source.web.title || source.web.uri}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button 
                            onClick={handleFindDentists} 
                            disabled={isLoading}
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                        >
                           Search Again
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default FindDentist;