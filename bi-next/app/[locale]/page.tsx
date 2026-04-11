import React from 'react';
import { projectService } from '@/features/projects/services/project-api';
import { HomePageContent } from '@/features/marketing/ui/home-page-content';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['projects', 'latest'],
    queryFn: () => projectService.getLatestProjects(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageContent />
    </HydrationBoundary>
  );
}


