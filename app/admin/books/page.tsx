import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {db} from "@/database/drizzle";
import { sql, eq } from "drizzle-orm";
import {books} from "@/database/schema";
import { desc, like, and, or } from "drizzle-orm";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { Edit, Trash2, Search, ChevronLeft, ChevronRight} from "lucide-react";
import { deleteBook } from "@/lib/actions/book";
import {toast} from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import{Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";

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
    whereClause.push(and(books.genre.eq(selectedGenre)));
  }

   // Get total count for pagination
   const totalItems = await db
   .select({ count: sql`count(*)` })
   .from(books)
   .where(and(...whereClause));

  const totalPages = Math.ceil(totalItems[0].count / ITEMS_PER_PAGE);

  // Get filtered and paginated books
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

       {/* Bulk Actions */}
       <div className="mt-4 flex items-center gap-2">
        <Checkbox id="selectAll" />
        <label htmlFor="selectAll" className="text-sm">Select All</label>
        <Button 
          variant="destructive" 
          size="sm"
          className="ml-4"
          disabled={true}
        >
          Delete Selected
        </Button>
      </div>

      <div className="mt-4 w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
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
              <TableRow key={book.id}>
                <TableCell>
                  <Checkbox id={`select-${book.id}`} />
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
                      className="h-8 w-8"
                    >
                      <Link href={`/admin/books/${book.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <form >
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems[0].count)} of {totalItems[0].count} books
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            asChild
          >
            <Link href={`/admin/books?page=${currentPage - 1}&search=${search}&genre=${selectedGenre}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            asChild
          >
            <Link href={`/admin/books?page=${currentPage + 1}&search=${search}&genre=${selectedGenre}`}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

    </section>
  );
};

export default Page;
