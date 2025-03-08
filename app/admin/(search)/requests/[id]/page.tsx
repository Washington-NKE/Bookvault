import React from "react";
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import RequestStatusBadge from "@/components/admin/RequestStatusBadge";
import RequestActions from "@/components/admin/RequestActions";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  // Fetch borrow request details with book and user info
  const [requestDetails] = await db
    .select({
      id: borrowRecords.id,
      userId: borrowRecords.userId,
      bookId: borrowRecords.bookId,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      status: borrowRecords.status,
      createdAt: borrowRecords.createdAt,
      
      // Book details
      bookTitle: books.title,
      bookAuthor: books.author,
      bookGenre: books.genre,
      bookCoverUrl: books.coverUrl,
      bookDescription: books.description,
      bookCoverColor: books.coverColor,
      
      // User details
      userName: users.fullName,
      userEmail: users.email,
      userRegistrationNumber: users.registrationNumber,
      userRole: users.role, // Include the user's role
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .where(eq(borrowRecords.id, id))
    .limit(1);

  if (!requestDetails) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Request Not Found</h1>
        <p>The requested borrow request could not be found.</p>
      </div>
    );
  }

  // Calculate days remaining if borrowed
  const daysRemaining = requestDetails.status === "BORROWED" 
    ? Math.ceil((new Date(requestDetails.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Determine if the current user is an admin
  let isAdmin = false;
  if (session?.user?.id) {
    // Fetch the user's role from the database
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    isAdmin = user?.role === "ADMIN";
  }

  return (
    <>
      <div className="request-header mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Borrow Request</h1>
          <RequestStatusBadge status={requestDetails.status} />
        </div>
        <p className="text-light-100">
          Request ID: {requestDetails.id}
        </p>
      </div>

      <div className="request-overview grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="book-info flex border border-light-900 rounded-lg overflow-hidden">
          <div 
            className="w-32 h-full relative" 
            style={{ backgroundColor: requestDetails.bookCoverColor }}
          >
            <Image 
              src={requestDetails.bookCoverUrl} 
              alt={requestDetails.bookTitle}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 flex flex-col flex-1">
            <Link href={`/books/${requestDetails.bookId}`} className="text-2xl font-semibold hover:text-primary-500">
              {requestDetails.bookTitle}
            </Link>
            <p className="text-lg text-light-200 mb-4">{requestDetails.bookAuthor}</p>
            <p className="text-sm bg-light-900 text-light-100 px-3 py-1 rounded-full inline-block mb-4 w-fit">
              {requestDetails.bookGenre}
            </p>
            <p className="line-clamp-3 text-light-100 mb-4">
              {requestDetails.bookDescription}
            </p>
          </div>
        </div>

        <div className="request-details border border-light-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Request Details</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-light-100 text-sm">Borrower</p>
              <Link href={`/users/${requestDetails.userId}`} className="text-lg font-medium hover:text-primary-500">
                {requestDetails.userName}
              </Link>
              <p className="text-sm">{requestDetails.userEmail}</p>
              <p className="text-sm">ID: {requestDetails.userRegistrationNumber}</p>
            </div>

            <div className="border-t border-light-900 pt-4">
              <p className="text-light-100 text-sm">Borrow Timeline</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm">Request Date</p>
                  <p className="font-medium">
                    {format(new Date(requestDetails.createdAt ?? Date.now()), "MMM d, yyyy")}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm">Borrow Date</p>
                  <p className="font-medium">
                    {requestDetails.borrowDate 
                      ? format(new Date(requestDetails.borrowDate), "MMM d, yyyy")
                      : "Pending"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm">Due Date</p>
                  <p className={`font-medium ${daysRemaining !== null && daysRemaining < 0 ? "text-red-500" : ""}`}>
                    {requestDetails.dueDate 
                      ? format(new Date(requestDetails.dueDate), "MMM d, yyyy")
                      : "Not set"}
                    {daysRemaining !== null && daysRemaining < 0 && " (Overdue)"}
                    {daysRemaining !== null && daysRemaining >= 0 && ` (${daysRemaining} days left)`}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm">Return Date</p>
                  <p className="font-medium">
                    {requestDetails.returnDate 
                      ? format(new Date(requestDetails.returnDate), "MMM d, yyyy")
                      : requestDetails.status === "RETURNED" ? "Processing" : "Not returned"}
                  </p>
                </div>
              </div>
            </div>
            
            {isAdmin && (
              <div className="border-t border-light-900 pt-4">
                <p className="text-light-100 text-sm mb-3">Admin Actions</p>
                <RequestActions 
                  requestId={requestDetails.id} 
                  currentStatus={requestDetails.status}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional sections like borrowing history, notes, etc. could go here */}
    </>
  );
};

export default Page;