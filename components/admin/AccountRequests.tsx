import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar } from '@radix-ui/react-avatar';

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
        <CardContent className="grid grid-cols-3 gap-4">
          {users.map((user, index) => (
            <div key={index} className="flex items-center space-x-4 rounded-lg border  p-2">
              <Avatar className="size-12">{user.name[0]}</Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountRequests
