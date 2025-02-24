import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {db} from "@/database/drizzle";
import { sql, eq } from "drizzle-orm";
import {books} from "@/database/schema";
import { desc, like, and, or } from "drizzle-orm";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { Edit, Trash2, ChevronLeft, ChevronRight, Check} from "lucide-react";
import { deleteBook } from "@/lib/actions/book";
import {toast} from "@/hooks/use-toast";
import BookCover from "@/components/admin/BookCover";

const ITEMS_PER_PAGE = 10;

const Page = async ({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; genre?: string };
}) => {
  const currentPage = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const selectedGenre = searchParams.genre || "";
  
  const whereClause = [];
  if (search) {
    whereClause.push(
      or(
        like(books.title, `%${search}%`),
        like(books.author, `%${search}%`)
      )
    );
  }
  if (selectedGenre) {
    whereClause.push(eq(books.genre, selectedGenre));
  }

   const totalItems = await db
   .select({ count: sql<number>`count(*)::int` })
   .from(books)
   .where(and(...whereClause));

   const totalPages = Math.ceil((totalItems[0] as { count: number}).count / ITEMS_PER_PAGE);

  const allBooks = await db
    .select()
    .from(books)
    .where(and(...whereClause))
    .orderBy(desc(books.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset((currentPage - 1) * ITEMS_PER_PAGE);

    const handleDeleteBook = async (bookId: string) => {
      'use server'
      try {
        await deleteBook(bookId);
        toast({
          title: "Success",
          description: "Book deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete book",
          variant: "destructive",
        });
        console.log(error)
      }
    };

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Books</h2>
        <Button className="bg-primary-admin" asChild>
          <Link href="/admin/books/new" className="text-white">
            + Create a New Book
          </Link>
        </Button>
      </div>

      <div className="mt-4 w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-light-300">
              <TableHead className="w-[30px]"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead className="text-center">Total Copies</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allBooks.map((book) => (
              <TableRow key={book.id} className="border-none">
                <TableCell>
                <label htmlFor={`select-${book.id}`} className="relative cursor-pointer flex items-center gap-2">
                    <div className="relative">
                      <input type="checkbox" id={`select-${book.id}`} className="inset-0 absolute  opacity-0 peer" />
                      <div className="peer-checked:opacity-70 peer-checked:ring-2 peer-checked:ring-blue-500">
                      <BookCover coverColor={book.coverColor} coverImage={book.coverUrl} variant="extraSmall" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
                        <Check className="size-5 text-blue-600 bg-white rounded-full p-0.5 shadow-md" />
                      </div>
                    </div>
                  </label>
                  
                </TableCell>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell className="text-center">{book.totalCopies}</TableCell>
                <TableCell className="text-center">{book.availableCopies}</TableCell>
                <TableCell className="text-center">{book.rating}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="size-4 text-green-500"
                    >
                      <Link href={`/admin/books/${book.id}/edit`}>
                        <Edit className="size-4" />
                      </Link>
                    </Button>
                    <form >
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="size-8" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      
      <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-gray-600">
          {totalItems[0].count > 0 
          ? `Showing ${Math.min(((currentPage - 1) * ITEMS_PER_PAGE) + 1, totalItems[0].count)} to ${Math.min(currentPage * ITEMS_PER_PAGE, totalItems[0].count)} of ${totalItems[0].count} books`
          : "No books found"}
        </p>
        <div className="flex gap-2">
           <Button variant="outline" size="icon" disabled={currentPage <= 1}>
                    {currentPage > 1 ? (
            <Link href={`/admin/books?page=${currentPage - 1}&search=${search}&genre=${selectedGenre}`}>
              <ChevronLeft className="size-4" />
            </Link>
            ) : (
                        <span className="flex items-center justify-center">
                          <ChevronLeft className="size-4 text-gray-400" />
                        </span>
                      )}
          </Button>
         <Button variant="outline" size="icon" disabled=     {currentPage >= totalPages}>
                     {currentPage < totalPages ? (
            <Link href={`/admin/books?page=${currentPage + 1}&search=${search}&genre=${selectedGenre}`}>
              <ChevronRight className="size-4" />
            </Link>
             ) : (
             <ChevronRight className="size-4 text-gray-400" />
                        )}
          </Button>
        </div>
      </div>

    </section>
  );
};

export default Page;
