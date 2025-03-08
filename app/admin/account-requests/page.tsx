
import Sort from '@/components/admin/Sort';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { desc, eq } from 'drizzle-orm';
import React from 'react';
import ClientTable from '@/components/admin/ClientTable';

// Server component
export default async function Page() {
  // Fetch data on the server
  const rawRequests = await db.select({
    name: users.fullName,
    email: users.email,
    createdAt: users.createdAt,
    registrationNumber: users.registrationNumber,
  }).from(users).where(eq(users.status, "PENDING")).orderBy(desc(users.createdAt));

  const requests = rawRequests.map(request => ({
    ...request,
    createdAt: request.createdAt ?? undefined
  }));
   
  return (
    <Card className='w-full max-w-4xl'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Account Registration Requests</CardTitle>
        <Sort />
      </CardHeader>
      <CardContent>
        {/* Pass the data to a client component for interactivity */}
        <ClientTable requests={requests} />
      </CardContent>
    </Card>
  );
}