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
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { RoleDropdown } from "@/components/admin/RoleDropdown";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";


const ITEMS_PER_PAGE = 10;

type UserRole = "ADMIN" | "USER";

async function updateUserRole(userId: string, role: UserRole) {
  'use server'
  
  await db.update(users)
    .set({ role })
    .where(eq(users.id, userId));
}

async function deleteUser(userId: string) {
  'use server'
  
  await db.delete(users)
    .where(eq(users.id, userId));
}

const page = async ({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; role?: string };
}) => {
  const currentPage = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
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
  if (selectedRole) {
    whereClause.push(eq(users.role, selectedRole as UserRole));
  }

  const totalItems = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(and(...whereClause));

  const totalPages =  totalItems[0]?.count ? Math.ceil(totalItems[0].count / ITEMS_PER_PAGE) : 1;

  const allUsers = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      registrationNumber: users.registrationNumber,
      role: users.role,
      lastActivityDate: users.lastActivityDate,
    })
    .from(users)
    .where(and(...whereClause))
    .orderBy(desc(users.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset((currentPage - 1) * ITEMS_PER_PAGE);

    const getColorFromName = (name: string) => {
      const colors = [
        "bg-red-200", "bg-blue-200", "bg-green-200", "bg-purple-200",
        "bg-pink-200", "bg-indigo-200", "bg-teal-200", "bg-amber-200"
      ];
      const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return colors[hash % colors.length];
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
          <TableHead>Last Active</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
          </TableHeader>
          <TableBody>
        {allUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
          <label htmlFor={`select-${user.id}`} className="relative cursor-pointer flex items-center gap-2">
            <div className="relative">
              <input type="checkbox" id={`select-${user.id}`} className="absolute inset-0 opacity-0 peer" />
              <Avatar className="peer-checked:opacity-70 peer-checked:ring-2 peer-checked:ring-blue-500">
            <AvatarFallback   className={`${getColorFromName(user.fullName)} text-black`}>
              {getInitials(user?.fullName || "IN")}
            </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
            <Check className="w-5 h-5 text-blue-600 bg-white rounded-full p-0.5 shadow-md" />
              </div>
            </div>
          </label>
            </TableCell>

            <TableCell className="font-medium">{user.fullName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.registrationNumber}</TableCell>
            <TableCell>
          <RoleDropdown
            currentRole={user.role as UserRole}
            userId={user.id}
            onUpdateRole={updateUserRole}
          />
            </TableCell>
            <TableCell>
          {user.lastActivityDate ? 
            new Date(user.lastActivityDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }) : '-'}
            </TableCell>
            <TableCell>
          <DeleteButton userId={user.id} onDelete={deleteUser} />
            </TableCell>
          </TableRow>
        ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {totalItems[0].count > 0 
          ? `Showing ${Math.min(((currentPage - 1) * ITEMS_PER_PAGE) + 1, totalItems[0].count)} to ${Math.min(currentPage * ITEMS_PER_PAGE, totalItems[0].count)} of ${totalItems[0].count} users`
          : "No users found"}
        </p>
        <div className="flex gap-2">
        <Button variant="outline" size="icon" disabled={currentPage <= 1}>
          {currentPage > 1 ? (
            <Link href={`/admin/users?page=${currentPage - 1}&search=${search}&role=${selectedRole}`}>
              <ChevronLeft className="size-4" />
            </Link>
          ) : (
            <span className="flex items-center justify-center">
              <ChevronLeft className="size-4 text-gray-400" />
            </span>
          )}
        </Button>
          <Button variant="outline" size="icon" disabled=     {currentPage >= totalPages}>
            {currentPage < totalPages ? (
              <Link href={`/admin/users?page=${currentPage + 1}&search=${search}&role=${selectedRole}`}>
                <ChevronRight className="size-4" />
              </Link>
            ) : (
              <ChevronRight className="size-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default page;