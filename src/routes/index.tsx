import { systemPathsQueryOptions } from '@/data/systemPathsQueryOptions';
import { useNavigateToFilepath } from '@/hooks/useNavigateToFilepath';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(systemPathsQueryOptions);
  },
  component: RedirectRootComponent,
});

function RedirectRootComponent() {
  const navigate = useNavigateToFilepath();
  const { data } = useSuspenseQuery(systemPathsQueryOptions);

  if (!data || !data.home) {
    return null;
  }

  navigate(data.home, true);
}
