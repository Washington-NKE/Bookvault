import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import {ScrollArea} from '../ui/scroll-area'
import { books } from '@/database/schema'
import { db } from '@/database/drizzle'
import { desc } from 'drizzle-orm'
import BookCover from '../BookCover'
import Link from 'next/link'

const RecentlyAddedBooks = async () => {
    const latestBooks = (await db
        .select()
        .from(books)
        .limit(10)
        .orderBy(desc(books.createdAt))) as Book[];
  return (
    <Card className='relative'>
        <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Recently Added Books</CardTitle>
            <Link href="/admin/account-requests" legacyBehavior>
                <a>
                <Button variant='ghost'>View all</Button>
                </a>
            </Link>
           
        </CardHeader>
        <CardContent>
            <Button className='flex  w-full items-center bg-light-300'><Plus className='mr-2 rounded-full bg-white' />Add New Book</Button>
            <ScrollArea className='mt-4 h-96'>
                <div className='flex flex-col gap-2'>
                {latestBooks.map((book, index)=>(
                    <div key={index} className='flex items-center space-x-4 rounded-md bg-light-300 p-2'>
                        <BookCover variant='extraSmall' coverColor={book.coverColor} coverImage={book.coverUrl} />
                        <div>
                            <p>{book.title}</p>
                            <p>{book.author}</p>
                        </div>
                    </div>      
                ))}
                </div>
            </ScrollArea>
        </CardContent>
        <div className='pointer-events-none  absolute inset-x-0  bottom-0  h-12  bg-gradient-to-t from-white to-transparent' />
    </Card>
  )
}

export default RecentlyAddedBooks
