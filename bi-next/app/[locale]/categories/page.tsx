import { AllCategoriesClient } from '@/features/navigation/ui/all-categories-client';
import { projectService } from '@/features/projects/services/project-api';

export const metadata = {
  title: 'All Categories | كل القطاعات',
  description: 'Browse investment opportunities by sector in the B&I network.',
};

export default async function AllCategoriesPage() {
  const projects = await projectService.getAllProjects();

  return (
    <div className="min-h-screen">
      <AllCategoriesClient projects={projects} />
    </div>
  );
}
