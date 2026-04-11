import React from 'react';
import { VerifyEmailContent } from '@/features/auth/ui/verify-email-content';

export const metadata = {
  title: 'Verify Email | تفعيل البريد الإلكتروني',
  description: 'A verification link has been sent to your email address.',
};

export default function VerifyEmailPage() {
  return (
    <VerifyEmailContent />
  );
}

