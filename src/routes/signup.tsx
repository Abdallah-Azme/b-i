import { createFileRoute } from '@tanstack/react-router';
import { Signup } from '@/pages/Signup';
import { z } from 'zod';

const signupSearchSchema = z.object({
  role: z.string().optional(),
});

export const Route = createFileRoute('/signup')({
  component: Signup,
  validateSearch: signupSearchSchema,
});
