import { getDirContents } from '@/ipa';
import { QueryClient, useQuery } from '@tanstack/react-query';

type UseDirContentsProps = {
  dirPath: string;
};

export const useDirContents = ({ dirPath }: UseDirContentsProps) => {
  return useQuery({
    queryKey: ['file-path', dirPath],
    queryFn: getDirContents.bind(null, dirPath, false),
    refetchOnWindowFocus: true,
  });
};

export const revalidateDirContents = (
  dirPath: string,
  queryClient: QueryClient
) => {
  queryClient.invalidateQueries({
    queryKey: ['file-path', dirPath],
  });
};
