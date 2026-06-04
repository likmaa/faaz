import { useQuery } from '@tanstack/react-query';
import { faqService, achievementService } from '../services/faqService';

export function useFaq() {
  return useQuery({ queryKey: ['faq'], queryFn: () => faqService.getAll(), staleTime: 30 * 60 * 1000 });
}

export function useAchievements(filters = {}) {
  return useQuery({ queryKey: ['achievements', filters], queryFn: () => achievementService.getAll(filters), staleTime: 5 * 60 * 1000 });
}

export function useAchievement(id) {
  return useQuery({ queryKey: ['achievement', id], queryFn: () => achievementService.getById(id), enabled: !!id, staleTime: 5 * 60 * 1000 });
}
