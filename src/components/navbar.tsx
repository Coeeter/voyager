import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Input } from './ui/input';
import { Toolbar } from './toolbar';

export const Navbar = () => {
  return (
    <header className="sticky top-0 bg-background">
      <nav className="flex gap-2 border border-b px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="aspect-square rounded-full"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="aspect-square rounded-full"
        >
          <ArrowRight className="size-5" />
        </Button>
        <div className="grid flex-1 grid-cols-5 gap-2">
          <Input placeholder="file path" className="col-span-3" />
          <Input placeholder="search" className="col-span-2" />
        </div>
      </nav>
      <Toolbar />
    </header>
  );
};
