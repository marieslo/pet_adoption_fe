import React, { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import PetCard from './PetCard';

export default function SearchResults({ petsData, loading, error }) {

  useEffect(() => {
  }, [petsData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center space-x-2 p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-4 text-red-600 font-bold">
        {error}
      </div>
    );
  }

  if (!petsData || petsData.length === 0) {
    return (
      <div className="flex justify-center items-center p-4 text-gray-500 font-medium">
        No pets found
      </div>
    );
  }

  const resultsCount = (
    <div className="flex justify-center items-center p-4 text-gray-700">
      Found {petsData.length} {petsData.length === 1 ? 'pet' : 'pets'}
    </div>
  );

  return (
    <div className="p-4">
      {resultsCount}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 max-h-[640px] overflow-y-auto px-4 py-6">
        {petsData.map((pet, index) => (
          <PetCard key={index} pet={pet} showLikeButton={true} />
        ))}
      </div>
    </div>
  );
}