import React from 'react';
import { LoginForm } from '@/features/auth/ui/LoginForm';

export const Login: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <LoginForm />
    </div>
  );
};
