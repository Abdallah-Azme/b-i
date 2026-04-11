import React from 'react';
import { projectService } from '@/features/projects/services/project-api';
import { DashboardClient } from '@/features/dashboard/ui/dashboard-client';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export const metadata = {
  title: 'Dashboard | لوحة التحكم',
  description: 'Manage your projects and investment portfolio.',
};

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAllProjects(),
  });

  return (
    <div className="min-h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardClient />
      </HydrationBoundary>
    </div>
  );
}

