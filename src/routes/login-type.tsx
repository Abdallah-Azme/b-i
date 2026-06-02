import { createFileRoute } from '@tanstack/react-router';
import { LoginType } from '@/pages/LoginType';

export const Route = createFileRoute('/login-type')({
  component: LoginType,
});
