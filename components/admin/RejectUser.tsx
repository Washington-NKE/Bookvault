"use server"

import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function rejectUser(email: string) {

  try {
    await db.update(users)
        .set({ status: "REJECTED" })
      .where(eq(users.email, email));
    
    revalidatePath('/admin/approvals');
    return { success: true, message: "User rejected successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Failed to reject user" };
  }
}

export default rejectUser;