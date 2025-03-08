import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverUrl: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "BORROWED" | "RETURNED";
}

const UserBorrowHistory = ({ borrowHistory }: { borrowHistory: BorrowRecord[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-light-900">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-light-100">Book</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-light-100">Borrowed</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-light-100">Due Date</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-light-100">Returned</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-light-100">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-light-100">Request</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-light-900">
          {borrowHistory.map((borrow) => (
            <tr key={borrow.id}>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-14 relative mr-3">
                    <Image 
                      src={borrow.bookCoverUrl} 
                      alt={borrow.bookTitle}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <Link href={`/books/${borrow.bookId}`} className="font-medium hover:text-primary-500">
                      {borrow.bookTitle}
                    </Link>
                    <p className="text-sm text-light-200">{borrow.bookAuthor}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {format(new Date(borrow.borrowDate), "MMM d, yyyy")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {format(new Date(borrow.dueDate), "MMM d, yyyy")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {borrow.returnDate 
                  ? format(new Date(borrow.returnDate), "MMM d, yyyy")
                  : "-"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  borrow.status === "BORROWED" ? "bg-blue-100 text-blue-800" : 
                  borrow.status === "RETURNED" ? "bg-green-100 text-green-800" : ""
                }`}>
                  {borrow.status}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Link href={`/requests/${borrow.id}`} className="text-primary-500 hover:text-primary-700">
                  View
                </Link>
              </td>
            </tr>
          ))}
          {borrowHistory.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-light-100">
                No borrowing history available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserBorrowHistory;