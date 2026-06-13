import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/projectService';

export function useProjects(filters = {}) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectService.getAll(filters),
  });
}

export function useProject(id) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getById(id),
    enabled: !!id,
  });
}

export function useRelatedProjects(id) {
  return useQuery({
    queryKey: ['projects-related', id],
    queryFn: () => projectService.getRelated(id),
    enabled: !!id,
  });
}
