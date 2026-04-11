import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/project-api';

export const useProjects = (category?: string) => {
  return useQuery({
    queryKey: ['projects', category],
    queryFn: () => projectService.getAllProjects(category),
  });
};

export const useLatestProjects = () => {
  return useQuery({
    queryKey: ['projects', 'latest'],
    queryFn: () => projectService.getLatestProjects(),
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectService.getProjectById(id),
    enabled: !!id,
  });
};
