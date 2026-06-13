import { useQuery } from '@tanstack/react-query';
import { recruitmentService } from '../services/recruitmentService';

export function useJobs()        { return useQuery({ queryKey: ['jobs'],        queryFn: () => recruitmentService.getJobs() }); }
export function useVolunteering(){ return useQuery({ queryKey: ['volunteering'], queryFn: () => recruitmentService.getVolunteering() }); }
export function useInternships() { return useQuery({ queryKey: ['internships'],  queryFn: () => recruitmentService.getInternships() }); }

export function useOffer(id) {
  return useQuery({
    queryKey: ['offer', id],
    queryFn: () => recruitmentService.getById(id),
    enabled: !!id,
  });
}
