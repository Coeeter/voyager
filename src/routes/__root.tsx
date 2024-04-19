import { Navbar } from '@/components/navbar';
import { SidebarLayout } from '@/components/sidebar';
import { systemPathsQueryOptions } from '@/data/systemPathsQueryOptions';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(systemPathsQueryOptions);
  },
  component: RootRouteComponent,
});

function RootRouteComponent() {
  return (
    <>
      <Navbar />
      <SidebarLayout className="mt-[130px] !h-[calc(100vh-130px)]">
        <Outlet />
      </SidebarLayout>
      <TanStackRouterDevtools />
    </>
  );
}
