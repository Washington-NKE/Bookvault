'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import BookList from '@/components/BookList';

const SearchBooks = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get values from URL
  const queryParam = searchParams.get('query') || '';
  const categoryParam = searchParams.get('category') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const limitParam = parseInt(searchParams.get('limit') || '10', 10);
  
  // Local state
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  
  // Explicitly log URL parameters for debugging
  useEffect(() => {
    console.log('URL parameters changed:', { 
      query: queryParam, 
      category: categoryParam, 
      page: pageParam,
      limit: limitParam
    });
  }, [queryParam, categoryParam, pageParam, limitParam]);
  
  // Fetch books whenever URL parameters change
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      
      const apiUrl = new URL('/api/search', window.location.origin);
      
      // Add parameters
      if (queryParam) apiUrl.searchParams.set('query', queryParam);
      if (categoryParam) apiUrl.searchParams.set('category', categoryParam);
      apiUrl.searchParams.set('page', pageParam.toString());
      apiUrl.searchParams.set('limit', limitParam.toString());
      
      console.log('Fetching books from:', apiUrl.toString());
      
      try {
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch books: ${res.status}`);
        }
        
        const data = await res.json();
        console.log(`Received ${data.books.length} books from API`);
        setBooks(data.books);
        setTotalPages(data.totalPages); // Assuming the API returns totalPages
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [queryParam, categoryParam, pageParam, limitParam]);
  
  // Handle category changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (newCategory) {
      newParams.set('category', newCategory);
    } else {
      newParams.delete('category');
    }
    
    // Reset to page 1 when category changes
    newParams.set('page', '1');
    
    router.push(`/search?${newParams.toString()}`);
  };
  
  // Clear search function
  const clearSearch = () => {
    router.push('/search');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-6">
      <div className="flex flex-col items-center justify-center text-center max-w-md w-full">
        <h1 className="text-xl font-bold mb-4 uppercase">Discover Your Next Great Read:</h1>
        <p className="text-2xl font-bold mb-4">
          Explore and Search for <span className='text-primary'>Any Book</span> In Our Library
        </p>
        
        {/* Search Input */}
        <div className="relative mb-6 w-full">
          <SearchBar placeholder="Search across library system..." />
          
          <select 
            value={categoryParam}
            onChange={handleCategoryChange}
            className='border p-2 rounded mt-2 w-full bg-[#1E1E1E] text-white'
          >
            <option value="">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Self Help">Self Help</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Programming">Programming</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Fantasy">Fantasy</option>
          </select>
        </div>
      </div>

      {/* Search Results Header */}
      {(queryParam || categoryParam) && (
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {queryParam && `Search Results for "${queryParam}"`}
            {categoryParam && !queryParam && `Category: ${categoryParam}`}
            {queryParam && categoryParam && ` in ${categoryParam}`}
          </h2>
          {(queryParam || categoryParam) && (
            <button 
              onClick={clearSearch}
              className="text-sm text-blue-400 hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* No Results State */}
      {!loading && books.length === 0 && (queryParam || categoryParam) && (
        <div className="flex flex-col items-center justify-center py-10">
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
          <button 
            onClick={clearSearch}
            className="bg-[#F5D78F] text-black px-4 py-2 rounded"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Books list */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <p className='text-gray-500'>Loading...</p>
        </div>
      ) : (
        books.length > 0 && (
          <BookList
            title={books.length > 0 ? `Found ${books.length} books` : ""}
            books={books}
            containerClassName="mt-8 w-full"
          />
        )
      )}

      {/* Pagination */}
      {books.length > 0 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button 
            onClick={() => {
              const newParams = new URLSearchParams(searchParams.toString());
              newParams.set('page', (pageParam - 1).toString());
              router.push(`/search?${newParams.toString()}`);
            }}
            disabled={pageParam <= 1}
            className="px-4 py-2 bg-[#1E1E1E] rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2 bg-[#1E1E1E] rounded">{pageParam}</span>
          <button 
            onClick={() => {
              const newParams = new URLSearchParams(searchParams.toString());
              newParams.set('page', (pageParam + 1).toString());
              router.push(`/search?${newParams.toString()}`);
            }}
            disabled={pageParam >= totalPages}
            className="px-4 py-2 bg-[#1E1E1E] rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBooks;