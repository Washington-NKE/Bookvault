import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { db } from '@/database/drizzle';
import { books, borrowRecords } from '@/database/schema';
import { desc, eq } from 'drizzle-orm';
import BookCover from '../BookCover';

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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Barrow Requests</CardTitle>
          <Button variant="ghost">View all</Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="relative h-48">
            {borrowedBooks.map((book, index) => (
              <div key={index} className="flex items-center space-x-4 border-b p-2">
                 <BookCover variant='extraSmall' coverColor={book.coverColor} coverImage={book.coverUrl} />
                <div>
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-500">{book.author} • {book.date}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <div className='pointer-events-none  absolute left-80 right-0 bottom-0  h-40 bg-gradient-to-t from-white to-transparent' />
      </Card>
    </div>
  )
}

export default BorrowRequests
