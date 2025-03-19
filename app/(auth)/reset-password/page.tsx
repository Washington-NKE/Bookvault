'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast({
        title: "Error",
        description: "Invalid reset link",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Your password has been reset successfully.",
        });
        // Redirect to sign-in page after a delay
        setTimeout(() => router.push('/sign-in'), 2000);
      } else {
        toast({
          title: "Error",
          description: data.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
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
        <h1 className="text-2xl font-semibold text-white">Reset Password</h1>
        <p className="text-light-100">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label htmlFor="password" className="capitalize block text-sm font-medium">
              New Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input mt-1"
              minLength={8}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="capitalize block text-sm font-medium">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input mt-1"
              minLength={8}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting || !token}
            className="form-btn w-full"
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
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