import { createFileRoute } from '@tanstack/react-router';
import { AllCategories } from '@/pages/AllCategories';

export const Route = createFileRoute('/categories')({
  component: AllCategories,
});
