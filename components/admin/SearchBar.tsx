'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Image from 'next/image';

interface BaseSearchItem {
  id: string | number;
  type: 'book' | 'user' | 'request';
}

interface BookSearchItem extends BaseSearchItem {
  type: 'book';
  title: string;
  author: string;
  category: string;
  coverUrl?: string;
}

interface UserSearchItem extends BaseSearchItem {
  type: 'user';
  name: string;
  email: string;
  borrowedBooks?: number;
}

interface RequestSearchItem extends BaseSearchItem {
  type: 'request';
  bookTitle: string;
  userName: string;
  requestDate: string;
}

type SearchItem = BookSearchItem | UserSearchItem | RequestSearchItem;

const AdminSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchResults = React.useCallback(async () => {
    setLoading(true);
    
    try {
      const apiUrl = new URL('/api/admin/search', window.location.origin);
      apiUrl.searchParams.set('query', query);
      apiUrl.searchParams.set('limit', '5');
      
      const res = await fetch(apiUrl);
      
      if (!res.ok) {
        throw new Error(`Search failed: ${res.status}`);
      }
      
      const data = await res.json();
      setResults(data.results);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        fetchResults();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      setShowResults(false);
      router.push(`/admin/search?query=${encodeURIComponent(query)}`);
    }
  };

  const navigateToItem = (item: SearchItem) => {
    setShowResults(false);
    
    if (item.type === 'book') {
      router.push(`/admin/books/${item.id}`);
    } else if (item.type === 'user') {
      router.push(`/admin/users/${item.id}`);
    } else if (item.type === 'request') {
      router.push(`/admin/requests/${item.id}`);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="search"
            className="w-full p-2 pl-10 text-sm text-white bg-[#1E1E1E] border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search books, users, requests..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 2 && setShowResults(true)}
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>

      {showResults && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-[#1E1E1E] border border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-gray-400 text-center">
              Loading...
            </div>
          ) : (
            <>
              {['book', 'user', 'request'].map(type => {
                const typeResults = results.filter(r => r.type === type);
                if (typeResults.length === 0) return null;
                
                return (
                  <div key={type} className="border-b border-gray-700 last:border-b-0">
                    <div className="px-4 py-2 text-xs text-gray-400 bg-[#252525]">
                      {type === 'book' ? 'Books' : type === 'user' ? 'Users' : 'Requests'}
                    </div>
                    {typeResults.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="px-4 py-3 hover:bg-[#252525] cursor-pointer flex items-center"
                        onClick={() => navigateToItem(item)}
                      >
                        {item.type === 'book' && (
                          <>
                            <div className="w-10 h-14 bg-[#2C2C2C] flex items-center justify-center mr-3">
                              {item.coverUrl ? (
                                <Image src={item.coverUrl} alt={item.title} width={40} height={56} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs text-gray-500">No Cover</span>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.title}</div>
                              <div className="text-xs text-gray-400">By {item.author}</div>
                              <div className="text-xs text-gray-400">{item.category}</div>
                            </div>
                          </>
                        )}
                        
                        {item.type === 'user' && (
                          <>
                            <div className="w-10 h-10 bg-[#2C2C2C] rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm">{item.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.name}</div>
                              <div className="text-xs text-gray-400">{item.email}</div>
                              <div className="text-xs text-gray-400">{item.borrowedBooks || 0} active books</div>
                            </div>
                          </>
                        )}
                        
                        {item.type === 'request' && (
                          <>
                            <div className="w-10 h-10 bg-[#2C2C2C] rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm">R</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.bookTitle}</div>
                              <div className="text-xs text-gray-400">By {item.userName}</div>
                              <div className="text-xs text-gray-400">
                                {new Date(item.requestDate).toLocaleDateString()}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
              
              <div className="p-2 text-center border-t border-gray-700">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowResults(false);
                    router.push(`/admin/search?query=${encodeURIComponent(query)}`);
                  }}
                  className="text-blue-400 text-sm hover:underline"
                >
                  View all results
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSearch;