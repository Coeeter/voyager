import { getDirContents } from '@/ipa';
import { queryOptions } from '@tanstack/react-query';

export const dirContentsQueryOptions = (path: string) =>
  queryOptions({
    queryKey: ['file-path', path],
    queryFn: getDirContents.bind(null, path, false),
    refetchOnWindowFocus: true,
  });
