import { systemPathsQueryOptions } from '@/data/systemPathsQueryOptions';
import { useAppStore } from '@/hooks/useAppStore';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(systemPathsQueryOptions);
  },
  component: RedirectRootComponent,
});

function RedirectRootComponent() {
  const router = useRouter();
  const navigate = useAppStore(state => state.navigate);
  const { data } = useSuspenseQuery(systemPathsQueryOptions);

  if (!data || !data.home) {
    return null;
  }

  navigate(data.home, true);

  router.navigate({
    to: '/$filepath',
    params: { filepath: data.home },
  });
}
