import { createFileRoute } from '@tanstack/react-router';
import { Login } from '@/pages/Login';
import { z } from 'zod';

const loginSearchSchema = z.object({
  role: z.string().optional(),
});

export const Route = createFileRoute('/login')({
  component: Login,
  validateSearch: loginSearchSchema,
});
