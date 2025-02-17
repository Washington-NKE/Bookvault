import React from "react";
import BookList from "@/components/BookList";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/auth";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.id) return;

  const borrowedBooks = (await db
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
    })
    .from(borrowRecords)
    .innerJoin(books, eq(books.id, borrowRecords.bookId))
    .where(
      and(
        eq(borrowRecords.userId, session.user.id),
        eq(borrowRecords.status, "BORROWED")
      )
    )
    .orderBy(desc(borrowRecords.borrowDate))) as Book[];

    const borrowDetails = await db
    .select({
      bookId: borrowRecords.bookId,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      status: borrowRecords.status,
    })
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.userId, session.user.id),
        eq(borrowRecords.status, "BORROWED")
      )
    );

    const borrowDetail = borrowDetails.reduce((acc, book) => {
      acc[book.id] = {
        borrowDate: new Date(book.borrowDate).toLocaleDateString(),
        dueDate: new Date(book.dueDate).toLocaleDateString(),
        status: book.status,
      };
      return acc;
    }, {} as Record<string, BorrowInfo>);

console.log(borrowDetail);

  return (
    <div className="container mx-auto px-4 py-8">
    <div className="mb-8">
      <h1 className="mb-2 text-white text-2xl   font-bold ">My Borrowed Books</h1>
      <p className="text-gray-600">
        {borrowedBooks.length === 0 
          ? "You haven't borrowed any books yet."
          : `You currently have ${borrowedBooks.length} borrowed ${
            borrowedBooks.length === 1 ? 'book' : 'books'
            }`
        }
      </p>
    </div>

    {borrowedBooks.length > 0 ? (
      <>
        <div className="mb-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Remember to return your books by their due date to avoid any penalties.
                </p>
              </div>
            </div>
          </div>
        </div>

        <BookList
        title="Borrowed Books"
        books={borrowedBooks}
        borrowDetails={borrowDetail}
        containerClassName="mt-28"
        />
      </>
    ) : (
      <div className="py-12 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p className="text-gray-600">Visit our library catalog to discover and borrow books.</p>
      </div>
    )}
  </div>
  );
};

export default Page;