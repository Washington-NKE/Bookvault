import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {Avatar, AvatarFallback } from '../ui/avatar';
import { getInitials } from '@/lib/utils';
import { db } from '@/database/drizzle';
import { users} from '@/database/schema';
import { desc, eq } from 'drizzle-orm';

const AccountRequests = async () => {
    const pendingAccounts = await db.select({
      name: users.fullName,
      email: users.email,
    }).from(users).where(eq(users.status, "PENDING")).orderBy(desc(users.createdAt));

  return (
    <div className='mt-6'>
       <Card>
        <CardHeader >
          <CardTitle>Account Requests</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {pendingAccounts.map((user, index) => (
            <div key={index} className="flex  w-48 flex-col items-center rounded-lg border p-4 shadow-sm"> 
               <Avatar>
              <AvatarFallback className="bg-amber-100">{getInitials(user?.name || "IN")}</AvatarFallback>
            </Avatar>
              <div>
                <p className="truncate font-medium ">{user.name}</p>
                <p className="w-full truncate text-sm text-gray-500 "> {user.email}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountRequests
