import { getSystemPaths } from '@/ipa';
import { queryOptions } from '@tanstack/react-query';

export const systemPathsQueryOptions = queryOptions({
  queryKey: ['get_system_paths'],
  queryFn: getSystemPaths,
});
