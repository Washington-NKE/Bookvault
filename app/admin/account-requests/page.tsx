import Sort from '@/components/admin/Sort';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInitials } from '@/lib/utils';
import { XCircle } from 'lucide-react';
import React from 'react'

const page = () => {
    const requests = [
        {
          name: "Darrell Steward",
          email: "darrell.s@gmail.com",
          dateJoined: "Dec 19 2023",
          universityIdNo: "9023423789",
          avatar: "/api/placeholder/32/32"
        },
        {
          name: "Marc Antman",
          email: "marc.new@mail.com",
          dateJoined: "Dec 19 2023",
          universityIdNo: "4564234523",
          avatar: "/api/placeholder/32/32"
        },
        {
          name: "Susan Drake",
          email: "contact@student.edu",
          dateJoined: "Dec 19 2023",
          universityIdNo: "7831834289",
          avatar: "/api/placeholder/32/32"
        }
      ];
   
  return (
    <Card className='w-full max-w-4xl'>
        <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Account Registration Requests</CardTitle>
            <Sort />
        </CardHeader>
        <CardContent>
            <div className='grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4 px-4 py-2 text-sm text-gray-500'>
                <div>Name</div>
                <div>Date Joined</div>
                <div>Registration Number</div>
                <div>Actions</div>
            </div>
            <div className='space-y-2'>
                {requests.map((request, index)=>(
                    <div key={index} className='grid grid-cols-[2fr,1fr,1fr,1fr,auto] items-center gap-4 rounded-lg px-4 py-2 hover:bg-gray-50'>
                        <div className='flex items-center space-x-3'>
                        <Avatar>
                            <AvatarFallback className="bg-blue-200 font-bold text-blue-600 ">{getInitials(request.name || "IN")}</AvatarFallback>
                        </Avatar>
                            <div>
                                <div className='font-medium'>{request.name}</div>
                                <div className='text-sm text-gray-500'>{request.email}</div>
                            </div>
                        </div>
                        <div className='text-sm'>{request.dateJoined}</div>
                        <div className='text-sm'>{request.universityIdNo}</div>
                    <div className='flex items-center space-x-4'>
                        <Button size="sm" className='bg-green-200 hover:bg-green-600 text-green-700'>
                            Approve Account
                        </Button>
                        <Button variant="ghost" size="icon" className='text-red'>
                            <XCircle />
                        </Button>
                    </div>
                </div>
                ))}
            </div>
        </CardContent>
    </Card>
  );
}

export default page
