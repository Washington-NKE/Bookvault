import React from 'react';
import { db } from '@/database/drizzle';
import { books, borrowRecords, users } from '@/database/schema';
import { desc, eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BookCover from '@/components/BookCover';
import Sort from '@/components/admin/Sort';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

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

  const getStatusColor = (status: string)=> {
    switch (status) {
      case 'BORROWED':
        return 'text-purple-600 bg-purple-200';
      case 'LATE_RETURN':
        return 'text-red-600 bg-red-100';
      case 'RETURNED':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US',{
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  return (
    <div className='p-2'>
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Borrow Requests</CardTitle>
          <Sort />
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='rounded-lg  bg-light-400  text-left text-xs text-gray-500'>
                <th className='p-2'>Book</th>
                <th className='p-2'>User Requested</th>
                <th className='p-2'>Borrowed status</th>
                <th className='p-2'>Borrowed date</th>
                <th className='p-2'>Return date</th>
                <th className='p-2'>Due Date</th>
                <th className='p-2'>Receipt</th>
              </tr>
            </thead>
            <tbody>
            {borrowedBooks.map((book, index) => (
              <tr key={index} className='group'>
                <td className='py-4'>
                <div className='flex items-center space-x-3'>
                 <BookCover coverColor={book.coverColor} coverImage={book.coverUrl} variant='extraSmall' />
                <div>
                  <p className="line-clamp-1 font-medium">{book.title}</p>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </div>
                </div>
                </td>
                <td className='py-4'>
                  <div className='flex items-center space-x-3'>
                  <Avatar>
                    <AvatarFallback className="bg-blue-200 font-bold text-blue-600 ">{getInitials(book.userName || "IN")}</AvatarFallback>
                  </Avatar>
                  <div>
                      <p className='font-medium'>{book.userName}</p>
                      <p className='text-sm text-gray-500'>{book.userEmail}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`${getStatusColor(book.status)} text-sm cursor-pointer rounded-xl p-2  font-semibold`}>
                  {capitalizeFirstLetter(book.status.replace('_', ' '))}
                  </span>
                </td>
                <td className='py-4'>{formatDate(book.borrowedDate)}</td>
                <td className='py-4'>{book.returnDate}</td>
                <td className='py-4'>{book.dueDate}</td>
                <td>
                  <Button 
                  variant="outline"
                  size='sm'
                  className='text-blue-600 hover:text-blue-700'
                  >
                    <FileText className='mr-2 size-4' />
                    Generate
                  </Button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
          </div>
          
        </CardContent>
      </Card>
    </div>
  )
}

export default BorrowRequests
