import { FileTreeTable } from '@/components/file-tree-table';
import { dirContentsQueryOptions } from '@/data/dirContentsQueryOptions';
import { useAppStore } from '@/hooks/useAppStore';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/$filepath')({
  stringifyParams: ({ filepath }) => ({
    filepath: encodeURIComponent(filepath),
  }),
  parseParams: ({ filepath }) => ({
    filepath: decodeURIComponent(filepath),
  }),
  loader: async ({ context: { queryClient }, params: { filepath } }) => {
    return queryClient.ensureQueryData(dirContentsQueryOptions(filepath));
  },
  component: FilepathComponent,
});

function FilepathComponent() {
  const { filepath } = Route.useParams();
  const { data } = useSuspenseQuery(dirContentsQueryOptions(filepath));
  const { navigate, filePath: filePathFromState } = useAppStore();

  useEffect(() => {
    if (!filepath) return;
    if (filePathFromState?.value === filepath) return;
    navigate(filepath, true);
  }, [filepath]);

  return <FileTreeTable files={data} />;
}
