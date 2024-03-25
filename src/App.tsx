import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from './components/navbar';
import { useQuery } from '@tanstack/react-query';
import { getDirContents } from './ipa';

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['file-path'],
    queryFn: async () => {
      return await getDirContents('C:/users/nasru/Downloads').then(res =>
        res.sort((a, b) =>
          a.is_dir === b.is_dir ? 0
          : a.is_dir ? -1
          : 1
        )
      );
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ThemeProvider defaultTheme="system">
      <Navbar />
      <main>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </main>
    </ThemeProvider>
  );
}

export default App;
