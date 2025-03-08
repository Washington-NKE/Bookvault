'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';

type SearchBarProps = {
  placeholder?: string;
  searchType?: 'books' | 'users' | 'borrow-requests' | 'account-requests' | 'all';
}

export default function SearchBar({
  placeholder = "Search books, users, requests...",
  searchType = 'all'
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  
  // Update internal state when URL changes
  useEffect(() => {
    setQuery(searchParams.get('query') || '');
  }, [searchParams]);
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query === searchParams.get('query')) {
        return; // No change, avoid unnecessary navigation
      }
      
      const params = new URLSearchParams(searchParams.toString());
      
      if (query) {
        params.set('query', query);
        params.set('type', searchType);
        params.set('page', '1'); // Reset to first page on new search
      } else {
        params.delete('query');
      }
      
      console.log('SearchBar updating URL:', `${pathname}?${params.toString()}`);
      router.push(`${pathname}?${params.toString()}`);
    }, 500); // 500ms debounce for smoother UX
    
    return () => clearTimeout(delayDebounceFn);
  }, [query, searchType, router, pathname, searchParams]);
  
  const clearSearch = () => {
    setQuery('');
  };
  
  return (
    <div className="relative">
      <div className="flex items-center border rounded-lg px-3 py-2 w-full bg-[#1E1E1E]">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-white ml-2 bg-transparent outline-none"
        />
        {query && (
          <button onClick={clearSearch} className="text-gray-400">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}