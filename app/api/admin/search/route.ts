import { NextResponse, NextRequest } from 'next/server';
import { books, users, borrowRecords } from '@/database/schema';
import { eq, or, like, and, sql } from 'drizzle-orm';
import { db } from '@/database/drizzle';

export async function GET(request: NextRequest) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Updated type definition to accept string or number for id
    type SearchResult = {
      id: string | number;
      type: 'book' | 'user' | 'request';
      [key: string]: string | number | Date | null | boolean;
    };
    
    let results: SearchResult[] = [];
    let total = 0;
    
    // Search based on type
    if (type === 'all' || type === 'books') {
      const bookResults = await searchBooks(query, type === 'books' ? limit : Math.floor(limit / 3), offset);
      results = [...results, ...bookResults.data];
      total += bookResults.total;
    }
    
    if (type === 'all' || type === 'users') {
      const userResults = await searchUsers(query, type === 'users' ? limit : Math.floor(limit / 3), offset);
      results = [...results, ...userResults.data];
      total += userResults.total;
    }
    
    if (type === 'all' || type === 'requests') {
      const requestResults = await searchRequests(query, type === 'requests' ? limit : Math.floor(limit / 3), offset);
      results = [...results, ...requestResults.data];
      total += requestResults.total;
    }
    
    // Return response
    return NextResponse.json({
      results,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}

async function searchBooks(query: string, limit: number, offset: number) {
  // Search books in the database with pagination
  const searchTerm = `%${query}%`;
  
  // Get matching books
  const bookResults = await db.select({
    id: books.id,
    type: sql<'book'>`'book'`.as('type'),
    title: books.title,
    author: books.author,
    genre: books.genre,
    coverUrl: books.coverUrl,
    availableCopies: books.availableCopies,
    totalCopies: books.totalCopies,
    description: books.description
  })
  .from(books)
  .where(
    query === '' ? 
    sql`1=1` : 
    or(
      like(books.title, searchTerm),
      like(books.author, searchTerm),
      like(books.genre, searchTerm),
      like(books.description, searchTerm)
    )
  )
  .limit(limit)
  .offset(offset);

  // Get total count for pagination
  const countResult = await db.select({
    count: sql`count(*)`
  })
  .from(books)
  .where(
    query === '' ? 
    sql`1=1` : 
    or(
      like(books.title, searchTerm),
      like(books.author, searchTerm),
      like(books.genre, searchTerm),
      like(books.description, searchTerm)
    )
  );
  
  const total = countResult[0]?.count || 0;

  return {
    data: bookResults,
    total: Number(total)
  };
}

async function searchUsers(query: string, limit: number, offset: number) {
  // Search users in the database with pagination
  const searchTerm = `%${query}%`;
  
  // Get matching users
  const userResults = await db.select({
    id: users.id,
    type: sql<'user'>`'user'`.as('type'),
    name: users.fullName,
    email: users.email,
    registrationNumber: users.registrationNumber,
    status: users.status,
    lastActivityDate: users.lastActivityDate
  })
  .from(users)
  .where(
    query === '' ? 
    sql`1=1` : 
    or(
      like(users.fullName, searchTerm),
      like(users.email, searchTerm),
      like(users.registrationNumber, searchTerm)
    )
  )
  .limit(limit)
  .offset(offset);

  // Get total count for pagination
  const countResult = await db.select({
    count: sql`count(*)`
  })
  .from(users)
  .where(
    query === '' ? 
    sql`1=1` : 
    or(
      like(users.fullName, searchTerm),
      like(users.email, searchTerm),
      like(users.registrationNumber, searchTerm)
    )
  );

  // Get borrowed books count for each user
  const enhancedUsers = await Promise.all(userResults.map(async (user) => {
    const borrowedCount = await db.select({
      count: sql`count(*)`
    })
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.userId, user.id),
        eq(borrowRecords.status, 'BORROWED')
      )
    );
    
    return {
      ...user,
      borrowedBooks: Number(borrowedCount[0]?.count || 0)
    };
  }));
  
  const total = countResult[0]?.count || 0;

  return {
    data: enhancedUsers,
    total: Number(total)
  };
}

async function searchRequests(query: string, limit: number, offset: number) {
  // Search borrowing requests with pagination and joins
  const searchTerm = `%${query}%`;
  
  // Get matching borrow records with book and user information
  const requestResults = await db.select({
    id: borrowRecords.id,
    type: sql<'request'>`'request'`.as('type'),
    userId: borrowRecords.userId,
    bookId: borrowRecords.bookId,
    borrowDate: borrowRecords.borrowDate,
    dueDate: borrowRecords.dueDate,
    returnDate: borrowRecords.returnDate,
    status: borrowRecords.status,
    bookTitle: books.title,
    userName: users.fullName
  })
  .from(borrowRecords)
  .innerJoin(books, eq(borrowRecords.bookId, books.id))
  .innerJoin(users, eq(borrowRecords.userId, users.id))
  .where(
    query === '' ? 
    sql`1=1` : 
    or(
      like(books.title, searchTerm),
      like(users.fullName, searchTerm)
    )
  )
  .limit(limit)
  .offset(offset);

  // Get total count for pagination
  const countResult = await db.select({
    count: sql`count(*)`
  })
  .from(borrowRecords)
  .innerJoin(books, eq(borrowRecords.bookId, books.id))
  .innerJoin(users, eq(borrowRecords.userId, users.id))
  .where(
    query === '' ? 
    sql`1=1` : 
    or(
      like(books.title, searchTerm),
      like(users.fullName, searchTerm)
    )
  );
  
  const total = countResult[0]?.count || 0;

  // Format the request results to match expected output format
  const formattedRequests = requestResults.map(request => ({
    id: request.id,
    type: 'request' as const,
    bookId: request.bookId,
    userId: request.userId,
    bookTitle: request.bookTitle,
    userName: request.userName,
    requestDate: request.borrowDate,
    status: request.status
  }));

  return {
    data: formattedRequests,
    total: Number(total)
  };
}