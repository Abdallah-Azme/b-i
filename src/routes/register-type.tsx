import { createFileRoute } from '@tanstack/react-router';
import { RegisterType } from '@/pages/RegisterType';

export const Route = createFileRoute('/register-type')({
  component: RegisterType,
});
