import { getDirContents } from '@/ipa';
import { useQuery } from '@tanstack/react-query';

type UseDirContentsProps = {
  dirPath: string;
};

export const useDirContents = ({ dirPath }: UseDirContentsProps) => {
  return useQuery({
    queryKey: ['file-path', dirPath],
    queryFn: getDirContents.bind(null, dirPath),
    retry: () => false,
  });
};
