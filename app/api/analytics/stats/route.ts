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

    // Get borrowed books counts
    const [currentBorrows] = await db
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

    const [previousBorrows] = await db
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

    // Get total users count and change
    const [currentUsers] = await db
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

    const [previousUsers] = await db
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

    // Get total books count and change
    const [currentBooks] = await db
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

    const [previousBooks] = await db
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
        current: currentBorrows.count || 0,
        change: (currentBorrows.count || 0) - (previousBorrows.count || 0)
      },
      totalUsers: {
        current: currentUsers.count || 0,
        change: (currentUsers.count || 0) - (previousUsers.count || 0)
      },
      totalBooks: {
        current: currentBooks.count || 0,
        change: (currentBooks.count || 0) - (previousBooks.count || 0)
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return Response.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}