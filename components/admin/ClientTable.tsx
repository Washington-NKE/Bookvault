"use client";

interface RequestType {
  name: string;
  email: string;
  createdAt?: Date;
  registrationNumber?: string;
}

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInitials } from '@/lib/utils';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Check, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import approveUser from '@/components/admin/ApproveUser';
import rejectUser from '@/components/admin/RejectUser';
import { useRouter } from 'next/navigation';

export default function ClientTable({ requests }: { requests: RequestType[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentEmail, setCurrentEmail] = useState('');
  const { toast } = useToast();

  const handleApprove = async (email: string) => {
    setCurrentEmail(email);
    try {
      const result = await approveUser(email);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      if (result.success) {
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (error) {
        console.log(error);
      toast({
        title: "Error",
        description: "Failed to approve user",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (email: string) => {
    if (confirm("Are you sure you want to reject this account request?")) {
      setCurrentEmail(email);
      try {
        const result = await rejectUser(email);
        toast({
          title: result.success ? "Success" : "Error",
          description: result.message,
          variant: result.success ? "default" : "destructive",
        });
        if (result.success) {
          startTransition(() => {
            router.refresh();
          });
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to reject user",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead className="hidden md:table-cell">Registration Number</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className='flex items-center space-x-3'>
                    <Avatar>
                      <AvatarFallback className="bg-blue-200 font-bold text-blue-600">
                        {getInitials(request.name || "IN")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='font-medium'>{request.name}</div>
                      <div className='text-sm text-gray-500'>{request.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">
                  {request.createdAt?.toDateString()}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  {request.registrationNumber}
                </TableCell>
                <TableCell>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-4'>
                    <Button 
                      size="sm" 
                      className='bg-green-200 hover:bg-green-600 text-green-700 w-full sm:w-auto'
                      onClick={() => handleApprove(request.email)}
                      disabled={isPending && currentEmail === request.email}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className='text-red-500 hover:text-red-700 hover:bg-red-100'
                      onClick={() => handleReject(request.email)}
                      disabled={isPending && currentEmail === request.email}
                    >
                      <XCircle />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                No pending registration requests
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}