export async function fetchSearchResults(
    query: string,
    type: string = 'all',
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const params = new URLSearchParams({
        query,
        type,
        page: page.toString(),
        limit: limit.toString()
      });
      
      const response = await fetch(`/api/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Search request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching search results:', error);
      return {
        books: [],
        users: [],
        borrowRequests: [],
        accountRequests: []
      };
    }
  }