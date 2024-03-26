import { getStartingPath } from '@/ipa';
import { useQuery } from '@tanstack/react-query';

export const useStartingPath = () => {
  return useQuery({
    queryKey: ['get_starting_path'],
    queryFn: getStartingPath,
    retry: () => false,
  });
};
