import { Navbar } from '@/components/navbar';
import { SidebarLayout } from '@/components/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="system">
      <Navbar />
      <SidebarLayout className="mt-[130px] !h-[calc(100vh-130px)]">
        <Outlet />
      </SidebarLayout>
      <TanStackRouterDevtools />
    </ThemeProvider>
  ),
});
