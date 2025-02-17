import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  videoUrl: string;
  summary: string;
  borrowInfo?: {
    borrowDate: string;
    dueDate: string;
    status: string;
  };
}

interface BookListProps {
  title?: string;
  books: Book[];
  containerClassName?: string;
  renderExtra?: (book: Book) => React.ReactNode;
}

const BorrowedBookList = ({ 
  title, 
  books, 
  containerClassName = "", 
  renderExtra 
}: BookListProps) => {
    console.log("Received books:", books);
  return (
    <section className={`book-list ${containerClassName}`}>
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="mt-2 h-1 w-20 bg-primary" />
        </div>
      )}

      {books.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-gray-500">No books found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {books.map((book) => (
            <Link
              href={`/books/${book.id}`}
              key={book.id}
              className="group"
            >
              <div 
                className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-md transition-transform duration-300 ease-in-out group-hover:scale-105"
                style={{ backgroundColor: book.coverColor }}
              >
                {book.coverUrl && (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="line-clamp-1 text-lg font-semibold group-hover:text-primary">
                  {book.title}
                </h3>

                <div className="space-y-1">
                  <p className="line-clamp-1 text-sm text-gray-600">
                    by {book.author}
                  </p>
                  <p className="text-sm text-gray-500">{book.genre}</p>
                  
                  <div className="flex items-center gap-1">
                    <Image
                      src="/icons/star.svg"
                      alt="rating"
                      width={16}
                      height={16}
                    />
                    <p className="text-sm">{book.rating}</p>
                  </div>

                  {book.availableCopies > 0 ? (
                    <p className="text-sm text-green-600">
                      {book.availableCopies} {book.availableCopies === 1 ? 'copy' : 'copies'} available
                    </p>
                  ) : (
                    <p className="text-sm text-red-600">Currently unavailable</p>
                  )}

                  {renderExtra && renderExtra(book)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default BorrowedBookList;