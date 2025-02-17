import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface BorrowInfo {
  borrowDate: string;
  dueDate: string;
  status: string;
}


interface BookCardProps {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  borrowInfo?: BorrowInfo | null; // ✅ Correctly defined
}

const BookCard = ({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  isLoanedBook = false,
  borrowInfo,
}: BookCardProps) => (
  <li className={cn(isLoanedBook && "xs:w-52 w-full")}>
    <Link
      href={`/books/${id}`}
      className={cn(isLoanedBook && "w-full flex flex-col items-center")}
    >
      <BookCover coverColor={coverColor} coverImage={coverUrl} />
{console.log("In book card", borrowInfo)}
      <div className={cn("mt-4", !isLoanedBook && "xs:max-w-40 max-w-28")}>
        <p className="book-title">{title}</p>
        <p className="book-genre">{genre}</p>
      </div>

      {borrowInfo && (
        <div className="mt-3 w-full">
          <div className="book-loaned">
            <Image
              src="/icons/calendar.svg"
              alt="calendar"
              width={18}
              height={18}
              className="object-contain"
            />
            <div className="borrow-info mt-2 text-sm text-gray-500">
          <p>Borrowed: {borrowInfo.borrowDate}</p>
          <p>Due: {borrowInfo.dueDate}</p>
          <p>Status: {borrowInfo.status}</p>
        </div>
          </div>

          <Button className="book-btn">Download receipt</Button>
        </div>
      )}
    </Link>
  </li>
);

export default BookCard;
