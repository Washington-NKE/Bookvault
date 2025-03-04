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
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        const params = new URLSearchParams(searchParams);
        params.set('query', query);
        params.set('type', searchType);
        params.set('page', '1'); // Reset to first page on new search
        
        router.push(`${pathname}?${params.toString()}`);
      } else if (searchParams.has('query')) {
        const params = new URLSearchParams(searchParams);
        params.delete('query');
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchType, router, pathname, searchParams]);

  return (
    <div className="relative">
      <div className="flex items-center border rounded-lg px-3 py-2 w-full">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 ml-2 bg-transparent outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}