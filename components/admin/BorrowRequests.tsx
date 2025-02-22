import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { db } from '@/database/drizzle';
import { books, borrowRecords, users } from '@/database/schema';
import { desc, eq } from 'drizzle-orm';
import BookCover from '../BookCover';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { getInitials } from '@/lib/utils';
import Image from 'next/image';

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
      status: borrowRecords.status,
      borrowedDate: borrowRecords.borrowDate,
      returnDate: borrowRecords.returnDate,
      dueDate: borrowRecords.dueDate,
      userName: users.fullName,
      userEmail: users.email,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .where(eq(borrowRecords.status, "BORROWED"))
    .orderBy(desc(borrowRecords.createdAt))
    .limit(10);

  return (
    <div >
      <Card className="relative col-span-2 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Barrow Requests</CardTitle>
          <Link href='/admin/book-requests' legacyBehavior>
          <a>
          <Button variant="ghost">View all</Button>
          </a>
          </Link>
        </CardHeader>
        <CardContent>
          <ScrollArea className="relative h-48">
            <div className='flex flex-col gap-2'>
            {borrowedBooks.map((book, index) => (
              <div key={index} className="flex flex-row items-center space-x-4 rounded-md bg-light-300 p-2">
                <div className='shrink-0'>
                 <BookCover variant='small' coverColor={book.coverColor} coverImage={book.coverUrl} />
                 </div>
                 <div className='flex-1'>
                <div>
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-500">By {book.author} • {book.genre}</p>
                </div>
                <div className='mt-2 flex flex-row items-center space-x-3'>
                  <Avatar className='size-6'>
                    <AvatarFallback className="bg-blue-200 font-bold text-blue-600 ">{getInitials(book.userName || "IN")}</AvatarFallback>
                  </Avatar>
                  
                      <p className='font-medium'>{book.userName}</p>
                      <div className='ml-2 mr-0'>
                      <Image src="icons/clock.svg" alt="C" width={16} height={16}  />
                      </div>
                      <p className='text-sm text-gray-500'>{book.borrowedDate.toLocaleDateString()}</p>
                  </div>
                  </div>
              </div>
            ))}
            </div>
          </ScrollArea>
        </CardContent>
        <div className=' pointer-events-none   absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t
        from-white to-transparent' />
      </Card>
    </div>
  )
}

export default BorrowRequests
