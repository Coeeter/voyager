import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from './components/navbar';
import { Home } from './pages/home';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Navbar />
      <main className="mt-[130px] h-[calc(100vh-130px)] overflow-auto">
        <Home />
      </main>
    </ThemeProvider>
  );
}

export default App;
