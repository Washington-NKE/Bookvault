"use server"

import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function approveUser(email: string) {  
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

export default approveUser;