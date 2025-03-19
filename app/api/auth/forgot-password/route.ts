import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { passwordResetTokens } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { sendEmail } from '@/lib/email'; 

export async function POST(request: Request) {
  const { email } = await request.json();

  // Find the user
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    // Don't reveal whether a user exists or not for security reasons
    return NextResponse.json({ 
      success: true, 
      message: 'If your email exists in our system, you will receive a reset link shortly' 
    });
  }

  // Delete any existing tokens for this user
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));

  // Create a new token (valid for 1 hour)
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); 

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    token: token,
    expiresAt,
  });

  // Create reset link
  const resetLink = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/reset-password?token=${token}`;

  // Send email with reset link
  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      text: `Click the following link to reset your password: ${resetLink}`,
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'If your email exists in our system, you will receive a reset link shortly' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, message: 'Error sending email' }, { status: 500 });
  }
}