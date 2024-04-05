import { FileTreeTable } from '@/components/file-tree-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/hooks/useAppStore';
import { useCreateContent } from '@/hooks/useCreateContent';
import { useDirContents } from '@/hooks/useDirContents';
import { useEffect } from 'react';

export const Home = () => {
  const filePath = useAppStore(state => state.filePath);
  const { setParentFolder, setType } = useCreateContent();

  const { data, isLoading, error } = useDirContents({
    dirPath: filePath.value,
  });

  useEffect(() => {
    setParentFolder(filePath.value);
    setType(null);
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
    <section className="min-h-screen">
      <FileTreeTable files={data ?? []} />
    </section>
  );
};
