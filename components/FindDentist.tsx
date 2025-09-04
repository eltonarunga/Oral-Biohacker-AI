import React from 'react';
import { Card } from './common/Card';

// Placeholder data for dentist profiles
const placeholderDentists = [
  {
    name: 'Dr. Evelyn Reed',
    specialty: 'General & Cosmetic Dentistry',
    address: '123 Dental Way, Smileytown, ST 12345',
    phone: '(123) 456-7890',
    rating: 4.9,
    reviews: 128,
  },
  {
    name: 'Dr. Marcus Chen',
    specialty: 'Orthodontics',
    address: '456 Aligner Ave, Braceburg, ST 67890',
    phone: '(234) 567-8901',
    rating: 4.8,
    reviews: 94,
  },
  {
    name: 'Dr. Sofia Garcia',
    specialty: 'Pediatric Dentistry',
    address: '789 Molar St, Kidzville, ST 54321',
    phone: '(345) 678-9012',
    rating: 5.0,
    reviews: 210,
  },
];

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const FindDentist: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        Find a Dentist
      </h1>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name, specialty, or location..."
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-4 pl-12 focus:ring-cyan-500 focus:border-cyan-500"
          disabled // Non-functional for now
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon />
        </div>
      </div>

      {/* Dentist List */}
      <div className="space-y-4">
        {placeholderDentists.map((dentist, index) => (
          <Card key={index} className="hover:border-slate-600">
            <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="mb-4 sm:mb-0">
                    <h3 className="text-xl font-bold text-white">{dentist.name}</h3>
                    <p className="text-cyan-400">{dentist.specialty}</p>
                    <p className="text-slate-400 mt-2">{dentist.address}</p>
                    <p className="text-slate-400">{dentist.phone}</p>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(dentist.rating)} />)}
                        <span className="ml-2 text-white font-bold">{dentist.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-slate-500">{dentist.reviews} reviews</p>
                    <button className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-200">
                        View Profile
                    </button>
                </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FindDentist;
