import { useQuery } from '@tanstack/react-query';
import { newsService } from '../services/newsService';

export function useNews(filters = {}) {
  return useQuery({
    queryKey: ['news', filters],
    queryFn: () => newsService.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useNewsItem(id) {
  return useQuery({
    queryKey: ['news-item', id],
    queryFn: () => newsService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
