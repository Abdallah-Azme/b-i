import { SignupClient } from '@/features/auth/ui/signup-client';
import { Suspense } from 'react';

export const metadata = {
  title: 'Sign Up | إنشاء حساب جديد',
  description: 'Join the premier business and investment network in Kuwait.',
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <SignupClient />
    </Suspense>
  );
}
