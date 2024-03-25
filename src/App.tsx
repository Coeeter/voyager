import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from './components/navbar';
import { Home } from './pages/Home';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Navbar />
      <main>
        <Home />
      </main>
    </ThemeProvider>
  );
}

export default App;
