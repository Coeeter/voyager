import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/hooks/useAppStore';
import { useSystemPaths } from '@/hooks/useSystemPaths';
import { Home } from '@/pages/home';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: () => {
    const navigate = useAppStore(state => state.navigate);
    const { data, error, isLoading } = useSystemPaths();

    useEffect(() => {
      if (data?.home) navigate(data.home, true);
    }, [data]);

    return (
      <main className="w-full">
        {isLoading && <Skeleton className="h-10 w-full" />}
        {error && <div>Error: {error.message}</div>}
        {data && <Home />}
      </main>
    );
  },
});
