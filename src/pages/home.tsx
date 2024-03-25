import { FileTreeTable } from '@/components/file-tree-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/hooks/useAppStore';
import { useDirContents } from '@/hooks/useDirContents';
import { useEffect } from 'react';

export const Home = () => {
  const { filePath, setFilePath } = useAppStore();

  const { data, isLoading, error } = useDirContents({
    dirPath: filePath || 'C:/users/nasru/',
  });

  useEffect(() => {
    if (filePath === '/') {
      setFilePath('C:/users/nasru/');
    }
  }, []);

  useEffect(() => {
    document.querySelector('main')?.scrollTo(0, 0);
  }, [filePath]);

  if (isLoading)
    return (
      <section className="flex max-w-xl flex-col gap-3 p-6">
        {Array.from({ length: 64 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </section>
    );

  if (error) return <section className="p-6">Error: {error.message}</section>;

  return (
    <section className="max-w-3xl">
      <FileTreeTable files={data ?? []} />
    </section>
  );
};
