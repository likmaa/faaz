import { useQuery } from '@tanstack/react-query';
import { faqService, achievementService } from '../services/faqService';

export function useFaq() {
  return useQuery({ queryKey: ['faq'], queryFn: () => faqService.getAll() });
}

export function useAchievements(filters = {}) {
  return useQuery({ queryKey: ['achievements', filters], queryFn: () => achievementService.getAll(filters) });
}

export function useAchievement(id) {
  return useQuery({ queryKey: ['achievement', id], queryFn: () => achievementService.getById(id), enabled: !!id });
}
