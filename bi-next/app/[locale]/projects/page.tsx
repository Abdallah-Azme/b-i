import React from 'react';
import { projectService } from '@/features/projects/services/project-api';
import { ProjectListClient } from '@/features/projects/ui/project-list-client';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export async function generateMetadata() {
  return {
    title: 'Investment Opportunities | فرص الاستثمار',
    description: 'Browse the latest business opportunities and verified investments.',
  };
}

export default async function ProjectsPage() {
  const queryClient = new QueryClient();

  const defaultFilters = { category: '', listingType: '', sort: 'newest' };

  await queryClient.prefetchQuery({
    queryKey: ['projects', defaultFilters],
    queryFn: () => projectService.getAllProjects(defaultFilters),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectListClient />
      </HydrationBoundary>
    </div>
  );
}

