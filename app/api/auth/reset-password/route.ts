import { NextResponse } from 'next/server';
import { users, passwordResetTokens } from '@/database/schema';
import { eq, and, gt } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { db } from '@/database/drizzle';

export async function POST(request: Request) {
  const { token, password } = await request.json();

  // Find the valid token
  const resetToken = await db.query.passwordResetTokens.findFirst({
    where: and(
      eq(passwordResetTokens.token, token),
      gt(passwordResetTokens.expiresAt, new Date())
    ),
  });

  if (!resetToken) {
    return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
  }

  // Hash the new password
  const hashedPassword = await hash(password, 10);

  // Update the user's password
  await db.update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, resetToken.userId));

  // Delete the used token
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, resetToken.id));

  return NextResponse.json({ success: true, message: 'Password updated successfully' });
}