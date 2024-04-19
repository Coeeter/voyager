import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Toolbar } from './toolbar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useRouter } from '@tanstack/react-router';
import { useHistory } from '@/hooks/useHistory';

export const Navbar = () => {
  const { history } = useRouter();
  const {
    currentNode: { next, prev, filePath },
    goBack,
    goForward,
  } = useHistory();

  return (
    <header className="fixed top-0 z-10 w-full bg-background">
      <nav className="flex gap-2 border border-b px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="aspect-square rounded-full"
          disabled={!prev}
          onClick={() => {
            goBack();
            history.back();
          }}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="aspect-square rounded-full"
          disabled={!next}
          onClick={() => {
            goForward();
            history.forward();
          }}
        >
          <ArrowRight className="size-5" />
        </Button>
        <div className="grid flex-1 grid-cols-5 gap-2">
          <div className="col-span-3 flex items-center rounded-md border border-border px-4 text-sm">
            {filePath}
          </div>
          <Input placeholder="Search" className="col-span-2" />
        </div>
      </nav>
      <Toolbar />
    </header>
  );
};
