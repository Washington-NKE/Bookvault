import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq, like, or, and, desc } from 'drizzle-orm';
import { books, users, borrowRequests, accountRequests } from '@/lib/schema';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const query = searchParams.get('query')?.toLowerCase() || '';
  const type = searchParams.get('type') || 'all'; // books, users, borrow-requests, account-requests, all
  const limit = parseInt(searchParams.get('limit') || '10');
  const page = parseInt(searchParams.get('page') || '1');
  const offset = (page - 1) * limit;
  
  if (!query) {
    return NextResponse.json({
      books: [],
      users: [],
      borrowRequests: [],
      accountRequests: []
    });
  }
  
  try {
    const results: any = {};
    
    // Search books
    if (type === 'books' || type === 'all') {
      const bookResults = await db.select()
        .from(books)
        .where(
          or(
            like(books.title, `%${query}%`),
            like(books.author, `%${query}%`),
            like(books.category, `%${query}%`),
            like(books.description, `%${query}%`),
            like(books.isbn, `%${query}%`)
          )
        )
        .limit(limit)
        .offset(offset);
      
      results.books = bookResults;
    }
    
    // Search users
    if (type === 'users' || type === 'all') {
      const userResults = await db.select()
        .from(users)
        .where(
          or(
            like(users.name, `%${query}%`),
            like(users.email, `%${query}%`),
            like(users.username, `%${query}%`)
          )
        )
        .limit(limit)
        .offset(offset);
      
      results.users = userResults;
    }
    
    // Search borrow requests
    if (type === 'borrow-requests' || type === 'all') {
      const borrowResults = await db
        .select({
          request: borrowRequests,
          book: {
            title: books.title,
            author: books.author,
          },
          user: {
            name: users.name,
            email: users.email,
          }
        })
        .from(borrowRequests)
        .leftJoin(books, eq(borrowRequests.bookId, books.id))
        .leftJoin(users, eq(borrowRequests.userId, users.id))
        .where(
          or(
            like(books.title, `%${query}%`),
            like(books.author, `%${query}%`),
            like(users.name, `%${query}%`),
            like(users.email, `%${query}%`),
            like(borrowRequests.status, `%${query}%`)
          )
        )
        .limit(limit)
        .offset(offset);
      
      results.borrowRequests = borrowResults;
    }
    
    // Search account requests
    if (type === 'account-requests' || type === 'all') {
      const accountResults = await db
        .select()
        .from(accountRequests)
        .where(
          or(
            like(accountRequests.name, `%${query}%`),
            like(accountRequests.email, `%${query}%`),
            like(accountRequests.status, `%${query}%`)
          )
        )
        .limit(limit)
        .offset(offset);
      
      results.accountRequests = accountResults;
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}