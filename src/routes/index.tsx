import { systemPathsQueryOptions } from '@/data/systemPathsQueryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(systemPathsQueryOptions);
  },
  component: () => {
    const router = useRouter();
    const { data } = useSuspenseQuery(systemPathsQueryOptions);

    if (!data || !data.home) {
      return null;
    }

    router.navigate({
      to: '/$filepath',
      params: { filepath: data.home },
    });
  },
});
