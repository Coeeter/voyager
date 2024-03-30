import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from './components/navbar';
import { Home } from './pages/home';
import { useSystemPaths } from './hooks/useSystemPaths';
import { Skeleton } from './components/ui/skeleton';
import { SidebarLayout } from './components/sidebar';
import { useEffect } from 'react';
import { useAppStore } from './hooks/useAppStore';

function App() {
  const navigate = useAppStore(state => state.navigate);
  const { data, error, isLoading } = useSystemPaths();

  useEffect(() => {
    if (data?.home) navigate(data.home, true);
  }, [data]);

  return (
    <ThemeProvider defaultTheme="system">
      <Navbar />
      <SidebarLayout className="mt-[130px] !h-[calc(100vh-130px)]">
        <main className="w-full">
          {isLoading && <Skeleton className="h-10 w-full" />}
          {error && <div>Error: {error.message}</div>}
          {data && <Home />}
        </main>
      </SidebarLayout>
    </ThemeProvider>
  );
}

export default App;
