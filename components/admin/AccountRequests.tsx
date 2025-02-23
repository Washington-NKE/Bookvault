import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {Avatar, AvatarFallback } from '../ui/avatar';
import { getInitials } from '@/lib/utils';

const AccountRequests = () => {
    const users = [
        { name: "Marc Atenson", email: "marc@email.com" },
        { name: "Susan Drake", email: "susan@email.com" },
        { name: "Ronald Richards", email: "ronald@email.com" }
      ];
      
  return (
    <div className='mt-6'>
       <Card>
        <CardHeader >
          <CardTitle>Account Requests</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {users.map((user, index) => (
            <div key={index} className="w-48 rounded-lg border p-4 shadow-sm">  
               <Avatar>
              <AvatarFallback className="bg-amber-100">{getInitials(user?.name || "IN")}</AvatarFallback>
            </Avatar>
              <div>
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-sm text-gray-500 truncate w-full">{user.email}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountRequests
