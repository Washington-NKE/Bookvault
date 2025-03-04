import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
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
  
  let results = {
    books: [],
    users: [],
    borrowRequests: [],
    accountRequests: []
  };
  
  if (query) {
    results = await fetchSearchResults(query, type, page, limit);
  }
  
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
          {totalResults === 0 && query && (
            <p>No results found</p>
          )}
          {/* Render results here */}
        </TabsContent>
        
        {/* Render other TabsContent for books, users, etc. */}
      </Tabs>
    </div>
  );
}