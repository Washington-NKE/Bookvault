import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(   req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id =  params.id;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Receipt ID is required" }),
        { status: 400 }
      );
    } 
  const receiptId = id;

  const result = await db.select({
    receiptId: borrowRecords.id,
    issueDate: borrowRecords.borrowDate,
    dueDate: borrowRecords.dueDate,
    bookTitle: books.title,
    bookAuthor: books.author,
    bookGenre: books.genre,
  }).from(borrowRecords).innerJoin(books, eq(borrowRecords.bookId, books.id)).where(eq(borrowRecords.id, receiptId))
  
  if (!result.length) {
    return new Response(
      JSON.stringify({ error: "Receipt not found" }), 
      { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }

  // Format dates to ensure they're serializable
  const formattedResult = {
    ...result[0],
    issueDate: result[0].issueDate.toISOString(),
    dueDate: result[0].dueDate.toString(),
  };

  return new Response(
    JSON.stringify(formattedResult),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
} catch (error) {
  console.error('Error processing receipt request:', error);
  return new Response(
    JSON.stringify({ error: "Failed to process receipt request" }),
    { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
}
}


