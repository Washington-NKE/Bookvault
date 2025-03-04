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
  const [book, setBook] = useState(null);
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
        .where(eq(books.id, id));
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
      <h2 className="text-xl font-semibold mb-4">Edit Book</h2>
      <div className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <Input
          label="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <Input
          label="Total Copies"
          type="number"
          value={totalCopies}
          onChange={(e) => setTotalCopies(Number(e.target.value))}
        />
        <Input
          label="Available Copies"
          type="number"
          value={availableCopies}
          onChange={(e) => setAvailableCopies(Number(e.target.value))}
        />
        <Input
          label="Rating"
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <Button onClick={handleSave} className="bg-primary-admin text-white">
          Save
        </Button>
      </div>
    </section>
  );
};

export default EditBookPage;