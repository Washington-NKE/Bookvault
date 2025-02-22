import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollText } from "lucide-react";
import Receipt from "./Receipt";

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
  borrowInfo?: BorrowInfo; 
}

const hexToRgba = (hex: string, opacity: number) =>{
  hex= hex.replace("#","");

  if(hex.length === 3){
    hex = hex.split('').map(char => char + char).join("");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const BookCard = ({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  borrowInfo,
}: BookCardProps) => (
  <li className={cn(borrowInfo && "xs:w-52 w-full bg-dark-500 p-4 rounded-md shadow")}>
    <Link
      href={`/books/${id}`}
      className={cn(borrowInfo && "w-full flex flex-col items-center")}
    >
      <div style={{backgroundColor: hexToRgba(coverColor, 0.2)}} className="rounded-md p-4">
      <BookCover coverColor={coverColor} coverImage={coverUrl} {...(borrowInfo && {variant: "medium"})} />
      </div>
      
      <div className={cn("mt-4", !borrowInfo && "xs:max-w-40 max-w-28")}>
        <p className="book-title">{title}</p>
        <p className="book-genre">{genre}</p>
      </div>

      {borrowInfo && (
        <div className="mt-3 w-full">
          <div className="book-loaned">
            <div className="mt-2 text-sm text-gray-500">
              <div className="flex gap-2">
                <Image
                src="/icons/calendar.svg"
                alt="calendar"
                width={18}
                height={18}
                />
                <p>Borrowed: {borrowInfo.borrowDate}</p>
              </div>
            <div className="flex items-center justify-between ">
            <div className="flex gap-2">
              <Image
                src="/icons/clock.svg"
                alt="calendar"
                width={18}
                height={18}
              />
              <p>Due: {borrowInfo.dueDate}</p>
            </div>
            
           <Receipt receiptId={id} />
            </div>
        </div>
        </div>   
        </div>
      )}
    </Link>
  </li>
);

export default BookCard;
