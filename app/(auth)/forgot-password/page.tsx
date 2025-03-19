'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Password reset link has been sent to your email.",
        });
        // Only redirect after successful submission
        router.push('/sign-in');
      } else {
        toast({
          title: "Error",
          description: data.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-white">Forgot Password</h1>
        <p className="text-light-100">
          Enter your email address below and we&apos;ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label htmlFor="email" className="capitalize block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input mt-1"
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="form-btn w-full"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <p className="text-center text-base font-medium mt-4">
          Remember your password?{" "}
          <Button
            variant="link"
            onClick={() => router.push('/sign-in')}
            className="font-bold text-primary p-0"
          >
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
}