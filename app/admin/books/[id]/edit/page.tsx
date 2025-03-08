'use client'

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/database/drizzle';
import { books } from '@/database/schema';
import { toast } from '@/hooks/use-toast';
import { eq } from 'drizzle-orm';

const EditBookPage = () => {
  const router = useRouter();
  const { id } = router.query;
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
    createdAt: Date | null;
  }
  const [book, setBook] = useState<Book | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [totalCopies, setTotalCopies] = useState(0);
  const [availableCopies, setAvailableCopies] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (id) {
      // Fetch the book details from the database
      const fetchBook = async () => {
        const bookData = await db.select().from(books).where(eq(books.id, id as string));
        if (bookData.length > 0) {
          const book = bookData[0];
          setBook(book);
          setTitle(book.title);
          setAuthor(book.author);
          setGenre(book.genre);
          setTotalCopies(book.totalCopies);
          setAvailableCopies(book.availableCopies);
          setRating(book.rating);
        }
      };
      fetchBook();
    }
  }, [id]);

  const handleSave = async () => {
    try {
      await db.update(books)
        .set({
          title,
          author,
          genre,
          totalCopies,
          availableCopies,
          rating,
        })
        .where(eq(books.id, id as string));
      toast({
        title: 'Success',
        description: 'Book updated successfully',
      });
      router.push('/admin/books');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update book',
        variant: 'destructive',
      });
      console.error(error);
    }
  };

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <h2 className=" mb-4 text-xl font-semibold">Edit Book</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title">Title</label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="author">Author</label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="genre">Genre</label>
          <Input
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="totalCopies">Total Copies</label>
          <Input
            id="totalCopies"
            type="number"
            value={totalCopies}
            onChange={(e) => setTotalCopies(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="availableCopies">Available Copies</label>
          <Input
            id="availableCopies"
            type="number"
            value={availableCopies}
            onChange={(e) => setAvailableCopies(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="rating">Rating</label>
          <Input
            id="rating"
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
        </div>
        <Button onClick={handleSave} className="bg-primary-admin text-white">
          Save
        </Button>
      </div>
    </section>
  );
};

export default EditBookPage;