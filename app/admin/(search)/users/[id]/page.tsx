import React from "react";
import { db } from "@/database/drizzle";
import { eq, and } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import UserActivityChart from "@/components/admin/UserActivityChart";
import UserBorrowHistory from "@/components/admin/UserBorrowHistory";
import { users, borrowRecords, books } from "@/database/schema";

const Page = async ({ params }: { params: { id: string } }) => {
  const id = params.id;

  try {
    // Fetch user details
    const [userDetails] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!userDetails) {
      return (
        <div className="text-center mt-10">
          <h1 className="text-2xl font-bold">User Not Found</h1>
          <p>The requested user could not be found.</p>
        </div>
      );
    }

    // Fetch active borrows
    const activeBorrows = await db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        bookId: borrowRecords.bookId,
        bookTitle: books.title,
        bookAuthor: books.author,
        bookCoverUrl: books.coverUrl,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .where(
        and(
          eq(borrowRecords.userId, id),
          eq(borrowRecords.status, "BORROWED")
        )
      );

    // Fetch borrowing history
    const borrowHistory = await db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,
        bookId: borrowRecords.bookId,
        bookTitle: books.title,
        bookAuthor: books.author,
        bookCoverUrl: books.coverUrl,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .where(eq(borrowRecords.userId, id))
      .orderBy(borrowRecords.borrowDate);

    return (
      <>
        <div className="user-overview flex flex-col md:flex-row gap-8 mb-10">
          <div className="user-info flex-1">
            <h1 className="text-3xl font-bold mb-2">{userDetails.fullName}</h1>
            <p className="text-light-100 mb-4">
              Registration: {userDetails.registrationNumber}
            </p>

            <div className="user-details space-y-2 text-lg">
              <p>
                <span className="font-medium text-light-100">Email:</span> {userDetails.email}
              </p>
              <p>
                <span className="font-medium text-light-100">Status:</span>{" "}
                <span className={`${userDetails.status === "PENDING" ? "text-yellow-500" : userDetails.status === "APPROVED" ? "text-green-500" : "text-red-500"}`}>
                  {userDetails.status}
                </span>
              </p>
              <p>
                <span className="font-medium text-light-100">Role:</span>{" "}
                {userDetails.role}
              </p>
              <p>
                <span className="font-medium text-light-100">Member since:</span>{" "}
                {userDetails.createdAt ? format(new Date(userDetails.createdAt), "MMMM d, yyyy") : "N/A"}
              </p>
              <p>
                <span className="font-medium text-light-100">Last activity:</span>{" "}
                {userDetails.lastActivityDate ? format(new Date(userDetails.lastActivityDate), "MMMM d, yyyy") : "N/A"}
              </p>
            </div>
          </div>

          <div className="user-stats flex-1">
            <h3 className="text-xl font-semibold mb-4">Activity Summary</h3>
            <UserActivityChart borrowHistory={borrowHistory} />
          </div>
        </div>

        <div className="user-details">
          <section className="mb-10">
            <h3 className="text-xl font-semibold mb-4">Currently Borrowed Books ({activeBorrows.length})</h3>

            {activeBorrows.length === 0 ? (
              <p className="text-light-100">No currently borrowed books.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeBorrows.map((borrow) => (
                  <div key={borrow.id} className="book-card flex border border-light-900 rounded-lg overflow-hidden">
                    <div className="w-24 h-32 relative">
                      <Image
                        src={borrow.bookCoverUrl}
                        alt={borrow.bookTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <Link href={`/books/${borrow.bookId}`} className="font-medium hover:text-primary-500">
                          {borrow.bookTitle}
                        </Link>
                        <p className="text-sm text-light-200">{borrow.bookAuthor}</p>
                      </div>
                      <div className="text-sm">
                        <p>Borrowed: {format(new Date(borrow.borrowDate), "MMM d, yyyy")}</p>
                        <p>Due: <span className={`${new Date(borrow.dueDate) < new Date() ? "text-red-500" : ""}`}>
                          {format(new Date(borrow.dueDate), "MMM d, yyyy")}
                        </span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <h3 className="text-xl font-semibold mb-4">Borrowing History</h3>
            <UserBorrowHistory borrowHistory={borrowHistory} />
          </section>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>An error occurred while fetching user data.</p>
      </div>
    );
  }
};

export default Page;