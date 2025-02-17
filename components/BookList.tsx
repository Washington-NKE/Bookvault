import React from "react";
import BookCard from "@/components/BookCard";

interface BorrowInfo {
  borrowDate: string;
  dueDate: string;
  status: string;
}

interface Props {
  title: string;
  books: Book[];
  containerClassName?: string;
  borrowDetails?: (book: Book) => React.ReactNode;
}

const BookList = ({ title, books, containerClassName, borrowDetails = {} }: Props) => {
  console.log( "Passed Books",borrowDetails)
  if (title === "Latest Books" && books.length < 2) return;

  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

      <ul className="book-list">
        {books.map((book) => (
          <BookCard key={book.title} {...book} borrowInfo={borrowDetails[book.title] || null}/>
        ))}
      </ul>
    </section>
  );
};
export default BookList;
