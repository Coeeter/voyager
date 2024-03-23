import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from './components/navbar';
import { Toolbar } from './components/toolbar';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Navbar />
      <Toolbar />
      <main></main>
    </ThemeProvider>
  );
}

export default App;
