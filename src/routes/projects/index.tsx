import { createFileRoute } from '@tanstack/react-router';
import { Projects } from '@/pages/Projects';
import { z } from 'zod';

const projectsSearchSchema = z.object({
  cat: z.string().optional(),
});

export const Route = createFileRoute('/projects/')({
  component: Projects,
  validateSearch: projectsSearchSchema,
});
