import React from 'react';
import { FavoriteListClient } from '@/features/projects/ui/favorite-list-client';
import { projectService } from '@/features/projects/services/project-api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export const metadata = {
  title: 'My Favorites | المفضلة',
  description: 'View your saved projects and investment opportunities.',
};

export default async function FavoritesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAllProjects(),
  });

  return (
    <div className="min-h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FavoriteListClient />
      </HydrationBoundary>
    </div>
  );
}

