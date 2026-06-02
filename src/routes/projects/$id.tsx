import { createFileRoute } from '@tanstack/react-router';
import { ProjectDetails } from '@/pages/ProjectDetails';

export const Route = createFileRoute('/projects/$id')({
  component: ProjectDetails,
});
