'use server';

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

/**
 * Updates the status of a user in the database.
 * @param userId - The ID of the user to update.
 * @param status - The new status to set for the user.
 */
export const updateUserStatus = async (userId: string, status: string) => {
  try {
    await db
      .update(users)
      .set({ status }).where(eq(users.id, userId));

    return { success: true, message: "User status updated successfully" };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, message: "Failed to update user status" };
  }
};
