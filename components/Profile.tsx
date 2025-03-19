import React from 'react'
import { Card } from './ui/card'
import { db } from '@/database/drizzle'
import { users } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { Badge } from './ui/badge'
import { ShieldCheck, Clock, AlertCircle } from 'lucide-react'

const Profile = async ({userId}:{userId: string}) => {
  const user = await db.select().from(users).where(eq(users.id, userId)).then((res) => res[0]);

  if(!user) return null;

  const badgeConfig = {
    "APPROVED": {
      text: "Verified Student",
      icon: <ShieldCheck className='ml-0 mr-2 size-5 text-amber-500' />,
      color: "border-purple-500 text-purple-400"
    },
    "PENDING": {
      text: "Pending Verification",
      icon: <Clock className='ml-0 mr-2 size-5 text-blue-500' />,
      color: "border-blue-500 text-blue-400"
    },
    "REJECTED": {
      text: "Verification Failed",
      icon: <AlertCircle className='ml-0 mr-2 size-5 text-red-500' />,
      color: "border-red-500 text-red-400"
    }
  };

  const status = user.status || "PENDING";
  const badge = badgeConfig[status] || badgeConfig["PENDING"];

  return (
      <Card className='relative h-[500px]  w-[380px] border-none bg-[#1c1c27]  pt-10 text-white shadow-md'>
         <div className="absolute left-1/2  top-2 h-6 w-8 -translate-x-1/2 rounded-b-full bg-[#464F6F] "></div>

        <div className="absolute -top-6  left-1/2 h-9 w-8  -translate-x-1/2  bg-[#464F6F]"></div>

        <div className='absolute left-1/2  top-3 h-2 w-5 -translate-x-1/2 rounded-md bg-[#1c1c27]'></div>

        <div className='flex flex-col justify-between space-y-10 p-6 pb-2'>
          <div className='mb-4 flex items-center gap-3'>
            <div>
              <div className='flex items-center gap-2'>
                <Badge variant="outline" className={badge.color}>
                  {badge.icon}
                  {badge.text}
                </Badge>
                  
              </div>
              <h2 className='mt-5 text-xl font-semibold'>{user.fullName}</h2>
              <p className='text-sm text-gray-400'>{user.email}</p> 
            </div>
          </div>

          <div className='space-y-2'>
            <div>
              <p className='text-sm text-gray-400'>University</p>
              <p className='font-medium'>Dedan Kimathi University of Technology</p>
            </div>
            <div>
              <p className='text-sm text-gray-400'>Registration Number</p>
              <p className='font-medium'>{user.registrationNumber}</p>
            </div>
          </div>
        </div>
      </Card>
  )
}

export default Profile