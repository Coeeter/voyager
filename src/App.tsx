import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from './components/navbar';
import { Home } from './pages/home';
import { useStartingPath } from './hooks/useStartingPath';
import { Skeleton } from './components/ui/skeleton';

function App() {
  const { data, error, isLoading } = useStartingPath();

  return (
    <ThemeProvider defaultTheme="system">
      <Navbar />
      <main className="mt-[130px] h-[calc(100vh-130px)] overflow-auto">
        {isLoading && <Skeleton className="h-10 w-full" />}
        {error && <div>Error: {error.message}</div>}
        <Home startPath={data ?? '/'} />
      </main>
    </ThemeProvider>
  );
}

export default App;
