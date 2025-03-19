export { auth as middleware } from "@/auth";

export const publicRoutes = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',  // Add this line
  '/reset-password'    // Add this if you have a reset password page
];
