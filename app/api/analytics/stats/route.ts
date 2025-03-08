// app/api/analytics/stats/route.ts
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { and, gte, lte } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const currentMonth = new Date();
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    const previousMonthStart = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);
    const previousMonthEnd = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);
    
    // Get total borrowed books count (all time)
    const [totalBorrows] = await db
      .select({
        count: sql<number>`count(*)::integer`.as('count'),
      })
      .from(borrowRecords);
    
    // Get borrowed books for current and previous month (for change calculation)
    const [currentMonthBorrows] = await db
      .select({
        count: sql<number>`count(*)::integer`.as('count'),
      })
      .from(borrowRecords)
      .where(
        and(
          gte(borrowRecords.borrowDate, currentMonthStart),
          lte(borrowRecords.borrowDate, currentMonth)
        )
      );
    
    const [previousMonthBorrows] = await db
      .select({
        count: sql<number>`count(*)::integer`.as('count'),
      })
      .from(borrowRecords)
      .where(
        and(
          gte(borrowRecords.borrowDate, previousMonthStart),
          lte(borrowRecords.borrowDate, previousMonthEnd)
        )
      );
    
    // Get total users count (all time)
    const [totalUsers] = await db
      .select({
        count: sql<number>`count(*)::integer`.as('count'),
      })
      .from(users);
    
    // Get users for current and previous month (for change calculation)
    const [currentMonthUsers] = await db
      .select({
        count: sql<number>`count(*)::integer`.as('count'),
      })
      .from(users)
      .where(
        and(
          gte(users.createdAt, currentMonthStart),
          lte(users.createdAt, currentMonth)
        )
      );
    
    const [previousMonthUsers] = await db
      .select({
        count: sql<number>`count(*)::integer`.as('count'),
      })
      .from(users)
      .where(
        and(
          gte(users.createdAt, previousMonthStart),
          lte(users.createdAt, previousMonthEnd)
        )
      );
    
    // Get total books count (all time)
    const [totalBooks] = await db
      .select({
        count: sql<number>`count(*)::integer`.as('count'),
      })
      .from(books);
    
    // Get books for current and previous month (for change calculation)
    const [currentMonthBooks] = await db
      .select({
        count: sql<number>`count(*)::integer`.as('count'),
      })
      .from(books)
      .where(
        and(
          gte(books.createdAt, currentMonthStart),
          lte(books.createdAt, currentMonth)
        )
      );
    
    const [previousMonthBooks] = await db
      .select({
        count: sql<number>`count(*)::integer`.as('count'),
      })
      .from(books)
      .where(
        and(
          gte(books.createdAt, previousMonthStart),
          lte(books.createdAt, previousMonthEnd)
        )
      );
    
    return Response.json({
      borrowedBooks: {
        current: totalBorrows.count || 0,
        change: (currentMonthBorrows.count || 0) - (previousMonthBorrows.count || 0)
      },
      totalUsers: {
        current: totalUsers.count || 0,
        change: (currentMonthUsers.count || 0) - (previousMonthUsers.count || 0)
      },
      totalBooks: {
        current: totalBooks.count || 0,
        change: (currentMonthBooks.count || 0) - (previousMonthBooks.count || 0)
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return Response.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}