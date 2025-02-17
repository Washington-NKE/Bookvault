import React from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { desc, like, and, or, sql, eq } from "drizzle-orm";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { updateUserStatus } from "@/lib/actions/user";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge} from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ITEMS_PER_PAGE = 10;


const UserStatusBadge = ({ status }) => {
  switch (status) {
    case "APPROVED":
      return <Badge variant="success">Approved</Badge>;
    case "PENDING":
      return <Badge variant="warning">Pending</Badge>;
    case "REJECTED":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const page = async ({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; status?: string; role?: string };
}) => {
  const currentPage = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const selectedStatus = searchParams.status || "";
  const selectedRole = searchParams.role || "";

  
  const whereClause = [];
  if (search) {
    whereClause.push(
      or(
        like(users.fullName, `%${search}%`),
        like(users.email, `%${search}%`),
        like(users.registrationNumber, `%${search}%`)
      )
    );
  }
  if (selectedStatus) {
    whereClause.push(and(users.status.eq(selectedStatus)));
  }
  if (selectedRole) {
    whereClause.push(and(users.role.eq(selectedRole)));
  }

   // Get total count for pagination
   const totalItems = await db
   .select({ count: sql`count(*)` })
   .from(users)
   .where(and(...whereClause));

 const totalPages = Math.ceil(totalItems[0].count / ITEMS_PER_PAGE);

  // Get filtered and paginated users
  const allUsers = await db
    .select()
    .from(users)
    .where(and(...whereClause))
    .orderBy(desc(users.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset((currentPage - 1) * ITEMS_PER_PAGE);

    const handleUpdateStatus = async (userId: string, status: string) => {
      'use server'
      try {
        await updateUserStatus(userId, status);
        toast({
          title: "Success",
          description: "User status updated successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update user status",
          variant: "destructive",
        });
      }
    };
  
  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">User Management</h2>
      </div>

      <div className="mt-4 w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registration No.</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox id={`select-${user.id}`} />
                </TableCell>
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.registrationNumber}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <UserStatusBadge status={user.status} />
                </TableCell>
                <TableCell>
                  {new Date(user.lastActivityDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Manage User Status</DialogTitle>
                        <DialogDescription>
                          Update status for {user.fullName}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-2">
                        <form action={() => handleUpdateStatus(user.id, "APPROVED")}>
                          <Button 
                            variant="outline" 
                            className="bg-green-50 text-green-600 hover:bg-green-100"
                            disabled={user.status === "APPROVED"}
                          >
                            Approve
                          </Button>
                        </form>
                        <form action={() => handleUpdateStatus(user.id, "REJECTED")}>
                          <Button 
                            variant="outline"
                            className="bg-red-50 text-red-600 hover:bg-red-100"
                            disabled={user.status === "REJECTED"}
                          >
                            Reject
                          </Button>
                        </form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems[0].count)} of {totalItems[0].count} users
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            asChild
          >
            <Link href={`/admin/users?page=${currentPage - 1}&search=${search}&status=${selectedStatus}&role=${selectedRole}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            asChild
          >
            <Link href={`/admin/users?page=${currentPage + 1}&search=${search}&status=${selectedStatus}&role=${selectedRole}`}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      </section>
  )
}

export default page
