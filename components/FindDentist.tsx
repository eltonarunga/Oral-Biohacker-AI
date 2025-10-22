

import React, { useState } from 'react';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { findDentists } from '../services/apiService';
import { LocationSearchIllustration } from './common/illustrations/LocationSearchIllustration';
import { Dentist, GroundingChunk, DentistSearchResult } from '../types';

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
                    const searchResult = await findDentists(latitude, longitude);
                    setResult(searchResult);
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
                    setError(`Could not find dentists. ${errorMessage}`);
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
        <Card title="Find a Dentist Near You" icon={<span className="material-symbols-outlined">person_search</span>}>
            <div className="space-y-6">
                {!result && !isLoading && (
                     <div className="text-center py-8">
                        <LocationSearchIllustration className="w-40 h-40 mx-auto text-primary" />
                        <h3 className="mt-4 text-lg font-bold text-foreground-light dark:text-foreground-dark">Find Local Professionals</h3>
                        <p className="text-subtle-light dark:text-subtle-dark mt-2 mb-6 max-w-sm mx-auto">Use your current location to find nearby dental professionals recommended by our AI.</p>
                        <button 
                            onClick={handleFindDentists} 
                            disabled={isLoading}
                            className="bg-primary hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed animate-glow"
                        >
                           Use My Current Location
                        </button>
                    </div>
                )}
               
                {isLoading && <div className="min-h-[300px] flex items-center justify-center"><Spinner label="Finding dentists..."/></div>}
                
                {error && <p className="text-red-500/90 text-center bg-red-500/10 p-3 rounded-lg">{error}</p>}
                
                {result && (
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground-light dark:text-foreground-dark">Here are some dentists found near you:</h3>
                        <ul className="space-y-4">
                            {result.dentists.map((dentist, index) => (
                                <li key={index} className="bg-black/5 dark:bg-white/5 p-4 rounded-lg">
                                    <h4 className="font-bold text-foreground-light dark:text-foreground-dark text-md">{dentist.name}</h4>
                                    <p className="text-sm text-subtle-light dark:text-subtle-dark">{dentist.address}</p>
                                    <p className="text-sm text-subtle-light dark:text-subtle-dark">{dentist.phone}</p>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dentist.address)}`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline mt-2 inline-block"
                                    >
                                        View on Map &raquo;
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {result.sources.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-md font-semibold text-subtle-light dark:text-subtle-dark mb-2">Sources:</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {result.sources.map((source: GroundingChunk, index) => (
                                        <li key={index}>
                                            <a href={source.maps?.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                {source.maps?.title || source.maps?.uri}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button 
                            onClick={handleFindDentists} 
                            disabled={isLoading}
                            className="w-full mt-6 bg-primary/20 hover:bg-primary/30 text-primary font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
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