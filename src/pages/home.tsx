import { FileTreeTable } from '@/components/file-tree-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/hooks/useAppStore';
import { useDirContents } from '@/hooks/useDirContents';
import { useEffect } from 'react';

type HomeProps = {
  startPath: string;
};

export const Home = ({ startPath }: HomeProps) => {
  const { filePath, navigate } = useAppStore();

  const { data, isLoading, error } = useDirContents({
    dirPath: filePath.value,
  });

  useEffect(() => {
    navigate(startPath, true);
  }, [startPath]);

  useEffect(() => {
    document.getElementById('main')?.scrollTo(0, 0);
  }, [filePath]);

  if (isLoading)
    return (
      <section>
        {Array.from({ length: 64 }).map((_, i) => (
          <Skeleton key={i} className="container m-0 mb-1 h-10 w-full" />
        ))}
      </section>
    );

  if (error) return <section className="p-6">Error: {error.message}</section>;

  return (
    <section>
      <FileTreeTable files={data ?? []} />
    </section>
  );
};
