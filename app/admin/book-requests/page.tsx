import React from 'react';
import { db } from '@/database/drizzle';
import { books, borrowRecords } from '@/database/schema';
import { desc, eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import BookCover from '@/components/BookCover';

const BorrowRequests = async () => {
  const borrowedBooks = await db
  .select({
    id: books.id,
    title: books.title,
    author: books.author,
    genre: books.genre,
    rating: books.rating,
    coverUrl: books.coverUrl,
    coverColor: books.coverColor,
    description: books.description,
    totalCopies: books.totalCopies,
    availableCopies: books.availableCopies,
    videoUrl: books.videoUrl,
    summary: books.summary,
    createdAt: books.createdAt,
    returnDate: borrowRecords.returnDate,
  })
  .from(borrowRecords)
  .innerJoin(books, eq(borrowRecords.bookId, books.id))
  .where(eq(borrowRecords.status, "BORROWED"))
  .orderBy(desc(borrowRecords.createdAt))
  .limit(10);

  return (
    <div >
      <Card className="col-span-2">
        <CardHeader className="flex items-center">
          <CardTitle className='text-2xl'>Barrow Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="relative h-full">
            {borrowedBooks.map((book, index) => (
              <div key={index} className="flex items-center space-x-4 border-b p-2">
                 <BookCover coverColor={book.coverColor} coverImage={book.coverUrl} />
                <div>
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default BorrowRequests
