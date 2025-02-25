//import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
//import UserCard from '@/components/UserCard';
//import BorrowRequestCard from '@/components/BorrowRequestCard';
//import AccountRequestCard from '@/components/AccountRequestCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchSearchResults } from '@/lib/data-fetching';
import BookList from '@/components/BookList';

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: { query?: string; type?: string; page?: string; limit?: string };
}) {
  const query = searchParams.query || '';
  const type = searchParams.type || 'all';
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '10');
  
  // Default to empty results if no query
  let results = {
    books: [],
    users: [],
    borrowRequests: [],
    accountRequests: []
  };
  
  if (query) {
    results = await fetchSearchResults(query, type, page, limit);
  }
  
  // Count total results
  const totalResults = 
    results.books.length + 
    results.users.length + 
    results.borrowRequests.length + 
    results.accountRequests.length;
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      
      <div className="mb-6">
        <SearchBar placeholder="Search across library system..." searchType={type as any} />
      </div>
      
      {query && (
        <p className="mb-4 text-gray-600">
          {totalResults} results for "{query}"
        </p>
      )}
      
      <Tabs defaultValue={type}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="borrow-requests">Borrow Requests</TabsTrigger>
          <TabsTrigger value="account-requests">Account Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {/* Show all results */}
          {totalResults === 0 && query && (
            <p>No results found for "{query}"</p>
          )}
          
          {results.books.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-3">Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {results.books.map((book) => (
                  <BookList key={book.id} title="Search Results"
                  books={book.slice(1)}
                  containerClassName="mt-28" />
                ))}
              </div>
            </>
          )}
          
          {/* Similarly render other result types */}
          {/* ... */}
        </TabsContent>
        
        <TabsContent value="books">
          {results.books.length === 0 && query && (
            <p>No book results found for "{query}"</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </TabsContent>
        
        {/* Other tab contents for users, borrow requests, account requests */}
        {/* ... */}
      </Tabs>
    </div>
  );
}