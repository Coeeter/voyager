import { getSystemPaths } from '@/ipa';
import { useQuery } from '@tanstack/react-query';

export const useSystemPaths = () => {
  return useQuery({
    queryKey: ['get_system_paths'],
    queryFn: getSystemPaths,
    retry: () => false,
  });
};
