// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { ilike, or, and } from 'drizzle-orm';
import { db } from '@/database/drizzle';
import { books } from '@/database/schema';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;
  
  console.log('Search API called with:', { query, category, page, limit }); // Debug log
  
  try {
    let whereClause = undefined;
    
    // Only add filters if they're provided
    if (query || category) {
      const conditions = [];
      
      if (query) {
        conditions.push(
          or(
            ilike(books.title, `%${query}%`),
            ilike(books.author, `%${query}%`),
            ilike(books.genre, `%${query}%`),
            ilike(books.description, `%${query}%`)
          )
        );
      }
      
      if (category) {
        conditions.push(
          ilike(books.genre, `%${category}%`)
        );
      }
      
      // Combine conditions with AND
      whereClause = conditions.length > 1 
        ? and(...conditions) 
        : conditions[0];
    }
    
    console.log('Where clause created:', whereClause); // Debug log
    
    const results = await db.select()
      .from(books)
      .where(whereClause)
      .limit(limit)
      .offset(offset);
    
    console.log(`Found ${results.length} books`); // Debug log
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}