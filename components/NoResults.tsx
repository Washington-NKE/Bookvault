import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NoResultsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6">
      <div className=" flex flex-col items-center justify-center text-center max-w-md w-full">
        <h1 className="text-xl font-bold mb-4 uppercase">Discover Your Next Great Read:</h1>
        <p className="text-2xl font-bold mb-4">Explore and Search for <span className='text-primary'>Any Book</span> In Our Library</p>
        
        {/* Search Input */}
        <div className="relative mb-6">
          <Input 
            type="text" 
            placeholder="Thriller Mystery" 
            value="Triller Mystry"
            className="w-full bg-[#1E1E1E] text-white border-none rounded-lg py-3 px-4 text-lg"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>

        {/* No Results Found */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 h-48 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-6">
            <div className="w-32 h-32 bg-[#2C2C2C] rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-500">x</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
          <p className="text-gray-400 text-sm mb-6 text-center">
            We couldn&apos;t find any book matching your search. 
            Try using different keywords or check for typos.
          </p>

          <Button 
            variant="default" 
            className="bg-[#F5D78F] text-black hover:bg-[#F5D78F]/90"
          >
            Clear Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoResultsPage;