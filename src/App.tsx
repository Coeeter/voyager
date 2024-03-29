import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from './components/navbar';
import { Home } from './pages/home';
import { useSystemPaths } from './hooks/useSystemPaths';
import { Skeleton } from './components/ui/skeleton';
import { SidebarLayout } from './components/sidebar';

function App() {
  const { data, error, isLoading } = useSystemPaths();

  return (
    <ThemeProvider defaultTheme="system">
      <Navbar />
      <SidebarLayout className="mt-[130px] !h-[calc(100vh-130px)]">
        <main className="w-full">
          {isLoading && <Skeleton className="h-10 w-full" />}
          {error && <div>Error: {error.message}</div>}
          {data && <Home startPath={data.home ?? '/'} />}
        </main>
      </SidebarLayout>
    </ThemeProvider>
  );
}

export default App;
