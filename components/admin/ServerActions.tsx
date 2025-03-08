"use server";

import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function approveUser(email: string) {
  try {
    await db.update(users)
      .set({ status: "APPROVED" })
      .where(eq(users.email, email));
    
    revalidatePath('/admin/approvals');
    return { success: true, message: "User approved successfully" };
  } catch (error) {
    console.error("Error approving user:", error);
    return { success: false, message: "Failed to approve user" };
  }
}

export async function deleteUser(email: string) {
  try {
    await db.delete(users)
      .where(eq(users.email, email));
    
    revalidatePath('/admin/approvals');
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Failed to delete user" };
  }
}

export async function getRegistrationRequests() {
  return await db.select({
    name: users.fullName,
    email: users.email,
    createdAt: users.createdAt,
    registrationNumber: users.registrationNumber,
  }).from(users).where(eq(users.status, "PENDING")).orderBy(users.createdAt);
}