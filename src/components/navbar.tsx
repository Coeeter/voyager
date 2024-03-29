import { useAppStore } from '@/hooks/useAppStore';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';
import { Toolbar } from './toolbar';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const Navbar = () => {
  const { next, prev } = useAppStore(state => state.filePath);

  const { goBack, goForward } = useAppStore(state => ({
    goBack: state.goBack,
    goForward: state.goForward,
  }));

  const paths = useAppStore(state => {
    const paths = state.filePath.value.split('/').filter(Boolean);
    return paths.length > 4 ? paths.slice(paths.length - 3) : paths;
  });

  return (
    <header className="fixed top-0 z-10 w-full bg-background">
      <nav className="flex gap-2 border border-b px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="aspect-square rounded-full"
          disabled={!prev}
          onClick={goBack}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="aspect-square rounded-full"
          disabled={!next}
          onClick={goForward}
        >
          <ArrowRight className="size-5" />
        </Button>
        <div className="grid flex-1 grid-cols-5 gap-2">
          <div className="group relative col-span-3 flex items-center gap-3 rounded-md border border-border">
            {paths.map((dir, i) => {
              return (
                <React.Fragment key={i}>
                  {i !== 0 && <span className={'text-xs'}>/</span>}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={'relative z-20 text-xs hover:bg-background'}
                    tabIndex={-1}
                  >
                    {dir}
                  </Button>
                </React.Fragment>
              );
            })}
          </div>
          <Input placeholder="Search" className="col-span-2" />
        </div>
      </nav>
      <Toolbar />
    </header>
  );
};
