import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/project-api';

export const useProjects = (filters?: any) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectService.getAllProjects(filters),
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
