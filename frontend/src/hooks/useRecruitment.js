import { useQuery } from '@tanstack/react-query';
import { recruitmentService } from '../services/recruitmentService';

export function useJobs()        { return useQuery({ queryKey: ['jobs'],        queryFn: () => recruitmentService.getJobs(),        staleTime: 10 * 60 * 1000 }); }
export function useVolunteering(){ return useQuery({ queryKey: ['volunteering'], queryFn: () => recruitmentService.getVolunteering(), staleTime: 10 * 60 * 1000 }); }
export function useInternships() { return useQuery({ queryKey: ['internships'],  queryFn: () => recruitmentService.getInternships(),  staleTime: 10 * 60 * 1000 }); }

export function useOffer(id) {
  return useQuery({
    queryKey: ['offer', id],
    queryFn: () => recruitmentService.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
