// /api/borrow/[id]/route.ts
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { params } = context;
    if (!params || !params.id) {
      return NextResponse.json(
        { error: "Receipt ID is required" },
        { status: 400 }
      );
    }
    
    const receiptId = params.id;
    
    const result = await db.select({
      receiptId: borrowRecords.id,
      issueDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      bookTitle: books.title,
      bookAuthor: books.author,
      bookGenre: books.genre,
      bookId: books.id,
      userId: borrowRecords.userId,
      borrowerName: users.fullName,
      registrationNumber: users.registrationNumber, 
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .leftJoin(users, eq(borrowRecords.userId, users.id)) 
    .where(eq(borrowRecords.bookId, receiptId));

    
    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Receipt not found" },
        { status: 404 }
      );
    }

    const issueDate = new Date(result[0].issueDate);
    const dueDate = new Date(result[0].dueDate);
    const durationInDays = Math.ceil((dueDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const formattedResult = {
      ...result[0],
      issueDate: formatDate(issueDate),
      dueDate: formatDate(dueDate),
      duration: durationInDays
    };
    return NextResponse.json(formattedResult);
    
  } catch (error) {
    console.error('Error processing receipt request:', error);

    return NextResponse.json(
      { error: "Failed to process receipt request" },
      { status: 500 }
    );
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}