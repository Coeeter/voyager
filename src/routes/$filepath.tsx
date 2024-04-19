import { FileTreeTable } from '@/components/file-tree-table';
import { dirContentsQueryOptions } from '@/data/dirContentsQueryOptions';
import { useHistory } from '@/hooks/useHistory';
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
  const params = Route.useParams();

  const dirContentsQuery = useSuspenseQuery(
    dirContentsQueryOptions(params.filepath)
  );

  const updateHistory = useHistory(state => state.updateHistory);
  const currentHistoryNode = useHistory(state => state.currentNode);

  useEffect(() => {
    if (currentHistoryNode.filePath === params.filepath) return;
    updateHistory(params.filepath, true);
  }, [params.filepath]);

  return <FileTreeTable files={dirContentsQuery.data} />;
}
