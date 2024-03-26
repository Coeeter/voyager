import { FileTreeTable } from '@/components/file-tree-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/hooks/useAppStore';
import { useDirContents } from '@/hooks/useDirContents';
import { useEffect } from 'react';

type HomeProps = {
  startPath: string;
};

export const Home = ({ startPath }: HomeProps) => {
  const { filePath, setFilePath } = useAppStore();

  const { data, isLoading, error } = useDirContents({
    dirPath: filePath,
  });

  useEffect(() => {
    setFilePath(startPath);
  }, [startPath]);

  useEffect(() => {
    document.querySelector('main')?.scrollTo(0, 0);
  }, [filePath]);

  if (isLoading)
    return (
      <section className="container mx-auto">
        {Array.from({ length: 64 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
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
