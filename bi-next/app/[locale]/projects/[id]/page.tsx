import React from 'react';
import { notFound } from 'next/navigation';
import { projectService } from '@/features/projects/services/project-api';
import { ProjectDetailViewClient } from '@/features/projects/ui/project-detail-view-client';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await projectService.getProjectById(id);
  
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.name.en} | ${project.name.ar}`,
    description: project.descriptionShort.en,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['projects', id],
    queryFn: () => projectService.getProjectById(id),
  });

  const project = queryClient.getQueryData(['projects', id]);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-20">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectDetailViewClient id={id} />
      </HydrationBoundary>
    </div>
  );
}

